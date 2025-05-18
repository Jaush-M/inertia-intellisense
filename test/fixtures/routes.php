<?php

Route::inertia('event', 'Some/Page');

Inertia::render('Help');

inertia('Help');


Route::get('/', fn() => inertia('[admin]::dashboard'))->name('dashboard');
Route::get('/', fn() => inertia('[main]::dashboard'))->name('dashboard');
Route::get('/', fn() => inertia('[admin]::dashboard'))->name('dashboard');
