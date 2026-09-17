<?php

return array (
  'guard' => 'web',
  'modules' => 
  array (
    'dashboard' => 
    array (
      0 => 'view',
    ),
    'auth' => 
    array (
      0 => 'manage',
      1 => 'view_users',
    ),
    'users' => 
    array (
      0 => 'read',
      1 => 'create',
      2 => 'update',
      3 => 'delete',
    ),
    'roles' => 
    array (
      0 => 'read',
      1 => 'create',
      2 => 'update',
      3 => 'delete',
    ),
    'permissions' => 
    array (
      0 => 'read',
      1 => 'create',
      2 => 'update',
      3 => 'delete',
    ),
    'AdminPayroll' => 
    array (
      0 => 'view',
    ),
    'Payroll' => 
    array (
      0 => 'view',
    ),
    'AdminHr' => 
    array (
      0 => 'view',
    ),
    'hr' => 
    array (
      0 => 'view',
      1 => 'manage',
    ),
    'groups' => 
    array (
      0 => 'read',
      1 => 'create',
      2 => 'update',
      3 => 'delete',
      4 => 'assign_users',
    ),
  ),
  'labels' => 
  array (
    'module_names' => 
    array (
      'dashboard' => 'داشبورد',
      'auth' => 'احراز هویت',
      'permissions' => 'دسترسی ها',
      'users' => 'مدیریت کاربران',
      'roles' => 'نقش‌ها و دسترسی‌ها',
      'AdminPayroll' => 'مدیر فیش حقوقی',
      'Payroll' => 'فیش حقوقی',
      'AdminHr' => 'مدیریت کنترل تردد',
      'hr' => 'منابع انسانی',
      'groups' => 'گروه‌های کاربری',
    ),
    'actions' => 
    array (
      'read' => 'مشاهده',
      'create' => 'ایجاد',
      'update' => 'ویرایش',
      'delete' => 'حذف',
      'view' => 'نمایش',
      'manage' => 'مدیریت کل',
      'view_users' => 'مشاهده کاربران',
      'assign_users' => 'اختصاص کاربران',
    ),
  ),
);
