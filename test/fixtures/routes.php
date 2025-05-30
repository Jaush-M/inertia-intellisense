<?php

Route::inertia('event', 'Some/Page');

Inertia::render('Help');

Route::get('/', fn() => inertia('admin::dashboard'))->name('dashboard');
Route::get('/', fn() => inertia('[admin]::dashboard'))->name('dashboard');

inertia('Help');

inertia('dashboard');
inertia('main::dashboard');
inertia('(main)::dashboard');

inertia('admin::dashboard');
inertia('[admin]::dashboard');
inertia('(admin)::dashboard');

inertia('[admin]::settings.roles.index');
inertia('[admin]::settings/roles/index');

inertia('');