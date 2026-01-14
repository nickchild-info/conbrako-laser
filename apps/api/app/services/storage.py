"""S3-compatible storage service for file uploads."""
import boto3
from botocore.exceptions import ClientError, NoCredentialsError
from typing import Optional, BinaryIO
import uuid
import os
from datetime import datetime
from ..core.config import get_settings


class StorageService:
    """Service for uploading files to S3-compatible storage."""

    def __init__(self):
        """Initialize storage service with settings."""
        self.settings = get_settings()
        self._client = None
        self._local_storage_path = "/tmp/koosdoos-uploads"

    @property
    def client(self):
        """Lazy-load S3 client."""
        if self._client is None and self.settings.s3_access_key:
            self._client = boto3.client(
                "s3",
                endpoint_url=self.settings.s3_endpoint_url or None,
                aws_access_key_id=self.settings.s3_access_key,
                aws_secret_access_key=self.settings.s3_secret_key,
            )
        return self._client

    def _ensure_local_storage(self) -> str:
        """Ensure local storage directory exists."""
        if not os.path.exists(self._local_storage_path):
            os.makedirs(self._local_storage_path, exist_ok=True)
        return self._local_storage_path

    def _generate_file_key(self, original_filename: str, prefix: str = "designs") -> str:
        """Generate unique file key for storage."""
        file_ext = os.path.splitext(original_filename)[1].lower()
        unique_id = uuid.uuid4().hex[:12]
        timestamp = datetime.utcnow().strftime("%Y%m%d")
        return f"{prefix}/{timestamp}/{unique_id}{file_ext}"

    async def upload_file(
        self,
        file_content: bytes,
        original_filename: str,
        content_type: str,
        prefix: str = "designs"
    ) -> dict:
        """
        Upload file to storage (S3 or local fallback).

        Args:
            file_content: The file content as bytes
            original_filename: Original name of the file
            content_type: MIME type of the file
            prefix: Storage prefix/folder

        Returns:
            dict with file_id, file_url, and storage_key
        """
        file_key = self._generate_file_key(original_filename, prefix)
        file_id = uuid.uuid4().hex

        # Try S3 upload if configured
        if self.client and self.settings.s3_bucket:
            try:
                self.client.put_object(
                    Bucket=self.settings.s3_bucket,
                    Key=file_key,
                    Body=file_content,
                    ContentType=content_type,
                )

                # Generate URL
                if self.settings.s3_endpoint_url:
                    file_url = f"{self.settings.s3_endpoint_url}/{self.settings.s3_bucket}/{file_key}"
                else:
                    file_url = f"https://{self.settings.s3_bucket}.s3.amazonaws.com/{file_key}"

                return {
                    "file_id": file_id,
                    "file_url": file_url,
                    "storage_key": file_key,
                    "storage_type": "s3",
                }
            except (ClientError, NoCredentialsError) as e:
                # Fall through to local storage
                pass

        # Local storage fallback
        storage_path = self._ensure_local_storage()
        local_file_path = os.path.join(storage_path, file_key.replace("/", "_"))

        with open(local_file_path, "wb") as f:
            f.write(file_content)

        # Return local file URL (for development)
        file_url = f"/uploads/{os.path.basename(local_file_path)}"

        return {
            "file_id": file_id,
            "file_url": file_url,
            "storage_key": local_file_path,
            "storage_type": "local",
        }

    async def upload_thumbnail(
        self,
        file_content: bytes,
        original_file_key: str,
    ) -> Optional[str]:
        """
        Upload thumbnail image.

        Args:
            file_content: PNG thumbnail content
            original_file_key: Key of the original file

        Returns:
            URL to the thumbnail or None if upload fails
        """
        # Generate thumbnail key
        base_name = os.path.splitext(original_file_key)[0]
        thumb_key = f"{base_name}_thumb.png"

        # Try S3 upload if configured
        if self.client and self.settings.s3_bucket:
            try:
                self.client.put_object(
                    Bucket=self.settings.s3_bucket,
                    Key=thumb_key,
                    Body=file_content,
                    ContentType="image/png",
                )

                if self.settings.s3_endpoint_url:
                    return f"{self.settings.s3_endpoint_url}/{self.settings.s3_bucket}/{thumb_key}"
                else:
                    return f"https://{self.settings.s3_bucket}.s3.amazonaws.com/{thumb_key}"
            except (ClientError, NoCredentialsError):
                pass

        # Local storage fallback
        storage_path = self._ensure_local_storage()
        local_thumb_path = os.path.join(storage_path, thumb_key.replace("/", "_"))

        with open(local_thumb_path, "wb") as f:
            f.write(file_content)

        return f"/uploads/{os.path.basename(local_thumb_path)}"

    async def delete_file(self, file_key: str, storage_type: str = "s3") -> bool:
        """
        Delete a file from storage.

        Args:
            file_key: The storage key/path of the file
            storage_type: Type of storage ('s3' or 'local')

        Returns:
            True if deletion was successful
        """
        if storage_type == "s3" and self.client and self.settings.s3_bucket:
            try:
                self.client.delete_object(
                    Bucket=self.settings.s3_bucket,
                    Key=file_key,
                )
                return True
            except (ClientError, NoCredentialsError):
                return False
        elif storage_type == "local":
            try:
                if os.path.exists(file_key):
                    os.remove(file_key)
                    return True
            except OSError:
                return False
        return False
