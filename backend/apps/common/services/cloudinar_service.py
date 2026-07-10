import cloudinary.uploader


class CloudinaryService:
    """
    Central service for all Cloudinary operations in KinnectHub.
    """

    @staticmethod
    def upload_image(file, folder: str):
        """
        Uploads an image to Cloudinary.

        Returns:
            dict: {
                "url": secure_url,
                "public_id": public_id
            }
        """
        result = cloudinary.uploader.upload(
            file,
            folder=folder
        )

        return {
            "url": result.get("secure_url"),
            "public_id": result.get("public_id"),
        }

    @staticmethod
    def delete_image(public_id: str):
        """
        Deletes an image from Cloudinary using its public_id.
        """
        if not public_id:
            return

        cloudinary.uploader.destroy(public_id)