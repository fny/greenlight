# Greenlight 🚦

## Requirements
 
 - [Editorconfig Plugin](https://editorconfig.org/#download)
 - 

## Deployment

 - glit-api-staging
 - glit-api-production

## Short URLs

 - glit.me/m/* redirects to app.greenlightready.com/go/*
 - glit.me/a/* redirects to admin.greenlightready.com/go/*
 - glit.me/* redirects to greenlightready.com/*

## Naming conventions

### React

#### Resources

Say you want to add a posts concept to your app. Users should be able to perform CRUD operations. How should you structure your routes and pages?

For each action, you should add helpers to generate routes which map to pages as follows:

 - `postsPath => '/posts' => PostsPage`: View all posts
 - `postsNewPath => '/posts/new' => PostsNewPage`:  Create a new post
 - `postsDeletePath => '/posts/delete' => PostsDeletePage`: Perform delete on a collection of posts
 - `postsActionPath => '/posts/action' => PostsActionPage`: Perform an action on a collection of posts
 - `postPath => '/posts/:id' => PostPage`: View a post
 - `postEditPath => '/posts/:id/edit' => PostEditPage(id)`: Edit a post
 - `postDeletePath => '/posts/:id/delete' => PostDeletePage(id)`: Delete a post
 - `postActionPath => '/posts/:id/action' => PostActionPage(id)`: Perform an action on a post

Note this is very similar to how Rails does routing, however, we deliberately but the action after the resource for sorting.

All components corresponsing to pages should be in the `./pages/` directory or nested by resource (e.g. `./pages/posts/`)

Nested resources follow the same convention above:

 - `userPostsPath => 'users/:userId/posts' => UsersPostsPage(userId)`: View all posts for this user
 - `userPostPath => 'users/:userId/posts/:id' => UserPostsPage(userId, id)`: View a post by this user


Again components corresponsing to pages should be in the `./pages` directory. If you want to create a separate folder, follow the same pattern as before but do not nest (e.g. `./pages/usersPosts/`).

#### Shared Components

React components that are shared across pages in a single app go in the `./components` directory.

## Notes

### Covid Pathways

 - If nothing in survey is checked, proceed to school
 - If exposure only, stay home for 14 days
 - If diagnosed asymptomatic home for 10 days
 - If one symptom,
  - If positive or not tested:
    - 10 days since first symptoms
    - No fever for 24 hours (without fever reducing techniques)
    - Symptom improviment
  - Negative test
    - No fever for 24 hours
  - Confirmed alternative diagnosis

#### COLORS

LIGHT GREEN #33DA97

GREEN #00A183

DARK GREEN #0A322B

YELLOW #FFD034

PINK #FF3494

LIGHT GOLD #FFFAA1

GOLD #FFCD65

### UI Todo

#### User Settings

Your Information
Your Children
Add a Guardian
Approved Locations
Reminders and Notifications
Terms and Conditions
Software Licenses

TODO: Remove tests from app build
LINGUI FOR I18N
