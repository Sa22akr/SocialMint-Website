from django.contrib import admin
from .models import Task, User


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("title", "payout", "available", "platforms", "creator", "created_at")


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("username", "email", "balance", "earnings", "tasks_completed")
