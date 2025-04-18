from rest_framework import serializers
from .models import File

class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['id', 'name', 'file', 'size', 'file_type', 'upload_date', 'is_duplicate', 'original_file']
        read_only_fields = ['id', 'name', 'size', 'file_type', 'upload_date', 'is_duplicate', 'original_file']

    def create(self, validated_data):
        # The name will be set in the model's save() method
        return File.objects.create(**validated_data)
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Ensure the file URL is absolute
        if data['file']:
            request = self.context.get('request')
            if request is not None:
                data['file'] = request.build_absolute_uri(data['file'])
        return data

class StorageStatsSerializer(serializers.Serializer):
    total_files = serializers.IntegerField()
    unique_files = serializers.IntegerField()
    duplicate_files = serializers.IntegerField()
    storage_saved = serializers.IntegerField()