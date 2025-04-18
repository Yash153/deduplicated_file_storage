from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from .models import File
from .serializers import FileSerializer, StorageStatsSerializer
from django.db.models import Q
from django.db.models.functions import Lower
from django.core.paginator import Paginator
from django.http import JsonResponse

class FileViewSet(viewsets.ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['file_type', 'is_duplicate']
    search_fields = ['name']
    
    def get_queryset(self):
        queryset = File.objects.all()
        search = self.request.query_params.get('search', '')
        file_type = self.request.query_params.get('file_type', '')
        min_size = self.request.query_params.get('min_size', '')
        max_size = self.request.query_params.get('max_size', '')
        start_date = self.request.query_params.get('start_date', '')
        end_date = self.request.query_params.get('end_date', '')

        if search:
            queryset = queryset.filter(name__icontains=search)
        if file_type:
            queryset = queryset.filter(file_type__iexact=file_type)
        if min_size:
            queryset = queryset.filter(size__gte=min_size)
        if max_size:
            queryset = queryset.filter(size__lte=max_size)
        if start_date:
            queryset = queryset.filter(upload_date__gte=start_date)
        if end_date:
            queryset = queryset.filter(upload_date__lte=end_date)

        return queryset.order_by('-upload_date')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = request.query_params.get('page', 1)
        per_page = request.query_params.get('per_page', 10)

        paginator = Paginator(queryset, per_page)
        try:
            files = paginator.page(page)
        except:
            files = paginator.page(1)

        serializer = self.get_serializer(files, many=True)
        return Response({
            'results': serializer.data,
            'total': paginator.count,
            'pages': paginator.num_pages,
            'current_page': files.number
        })
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        total_files = File.objects.count()
        unique_files = File.objects.filter(original_file__isnull=True).count()
        duplicate_files = File.objects.filter(original_file__isnull=False).count()
        storage_saved = sum(file.size for file in File.objects.filter(original_file__isnull=False))
        
        return Response({
            'total_files': total_files,
            'unique_files': unique_files,
            'duplicate_files': duplicate_files,
            'storage_saved': storage_saved
        })
    
    @action(detail=False, methods=['get'])
    def file_types(self, request):
        # Get unique file types from the database
        file_types = File.objects.values_list('file_type', flat=True).distinct()
        return Response(list(file_types))