from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from .models import File
from .serializers import FileSerializer, StorageStatsSerializer

class FileViewSet(viewsets.ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['file_type', 'is_duplicate']
    search_fields = ['name']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Size range filter
        min_size = self.request.query_params.get('min_size')
        max_size = self.request.query_params.get('max_size')
        
        if min_size:
            queryset = queryset.filter(size__gte=min_size)
        if max_size:
            queryset = queryset.filter(size__lte=max_size)
            
        # Date range filter
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        
        if start_date:
            queryset = queryset.filter(upload_date__gte=start_date)
        if end_date:
            queryset = queryset.filter(upload_date__lte=end_date)
            
        return queryset
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        total_files = File.objects.count()
        unique_files = File.objects.filter(is_duplicate=False).count()
        duplicate_files = File.objects.filter(is_duplicate=True).count()
        storage_saved = File.get_storage_savings()
        
        data = {
            'total_files': total_files,
            'unique_files': unique_files,
            'duplicate_files': duplicate_files,
            'storage_saved': storage_saved
        }
        
        serializer = StorageStatsSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def file_types(self, request):
        # Get unique file types from the database
        file_types = File.objects.values_list('file_type', flat=True).distinct()
        return Response(list(file_types))