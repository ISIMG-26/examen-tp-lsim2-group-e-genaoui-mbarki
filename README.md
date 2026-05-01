# MindSpace

## Description

MindSpace est une application web de bien-être mental permettant aux utilisateurs de suivre leurs émotions, consigner leurs pensées et réfléchir sur leur quotidien dans un espace personnel sécurisé.

## Fonctionnalités

* Authentification utilisateur (inscription et connexion)
* Suivi de l’humeur
* Ajout de notes personnelles avec humeur associée
* Réflexions journalières avec affichage interactif
* Tableau de bord avec statistiques et calendrier d’humeur
* Suggestions rapides pour le bien-être

## Technologies utilisées

* Frontend : HTML, CSS, JavaScript
* Backend : PHP
* Base de données : MySQL

## Structure du projet

```text
mindspace/
├── api/
│   ├── auth.php
│   ├── journal.php
│   ├── mood.php
│   └── sessions.php
├── css/
│   └── app.css
├── js/
│   ├── app.js
│   ├── breathe.js
│   ├── dashboard.js
│   ├── mindmap.js
│   ├── mood.js
│   └── sanctuary.js
├── .htaccess
├── app.php
├── config.php
└── index.php

```

## Installation et exécution

```bash
# 1. Installer XAMPP
# 2. Placer le projet dans le dossier htdocs
# 3. Démarrer Apache et MySQL
# 4. Créer une base de données via phpMyAdmin
# 5. Importer le fichier SQL fourni dans le projet
# 6. Accéder à l’application

```

## Base de données

Un fichier SQL est fourni dans le dépôt pour initialiser automatiquement la base de données.

### Structure

### Table `users`

* id (INT, clé primaire)
* username (VARCHAR, unique)
* password (VARCHAR)

### Table `moods`

* id
* user_id
* mood
* created_at

### Table `notes`

* id
* user_id
* content
* mood
* created_at

### Table `reflections`

* id
* user_id
* question
* content
* mood
* created_at

## Auteur

* Nom : Gnaoui Mbarki

## Répartition des tâches

Projet réalisé individuellement

* Conception UI/UX
* Développement frontend
* Développement backend
* Gestion de la base de données

## Remarque

Le développement du projet a été réalisé de manière progressive en adoptant une approche structurée, avec des commits réguliers permettant de tracer l’évolution des fonctionnalités, d’assurer la cohérence du code et de refléter l’implication tout au long du projet.
