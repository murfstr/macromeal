from rest_framework.routers import DefaultRouter
from .views import MealPlanViewSet

router = DefaultRouter()
router.register('', MealPlanViewSet, basename='mealplan')

urlpatterns = router.urls
