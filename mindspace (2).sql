-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : ven. 01 mai 2026 à 12:38
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `mindspace`
--

-- --------------------------------------------------------

--
-- Structure de la table `achievements`
--

CREATE TABLE `achievements` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `achievement_key` varchar(50) NOT NULL,
  `achievement_name` varchar(100) NOT NULL,
  `earned_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `breathing_sessions`
--

CREATE TABLE `breathing_sessions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `pattern_name` varchar(50) NOT NULL,
  `duration_seconds` int(11) NOT NULL,
  `completed` tinyint(1) DEFAULT 1,
  `session_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `breathing_sessions`
--

INSERT INTO `breathing_sessions` (`id`, `user_id`, `pattern_name`, `duration_seconds`, `completed`, `session_date`) VALUES
(1, 1, 'relaxed', 64, 0, '2026-03-30 18:00:59'),
(2, 1, 'relaxed', 124, 1, '2026-03-30 18:03:04'),
(3, 2, 'energizing', 120, 1, '2026-03-31 10:01:09'),
(4, 4, 'energizing', 28, 0, '2026-04-03 20:02:20'),
(5, 5, 'energizing', 120, 1, '2026-04-22 09:14:37');

-- --------------------------------------------------------

--
-- Structure de la table `daily_prompts`
--

CREATE TABLE `daily_prompts` (
  `id` int(11) NOT NULL,
  `prompt_text` text NOT NULL,
  `category` enum('reflection','gratitude','growth','dream','challenge') DEFAULT 'reflection',
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `daily_prompts`
--

INSERT INTO `daily_prompts` (`id`, `prompt_text`, `category`, `is_active`) VALUES
(1, 'What made you smile unexpectedly today?', 'gratitude', 1),
(2, 'What is one thing you would tell your past self?', 'reflection', 1),
(3, 'Describe a moment today where you felt fully present.', 'reflection', 1),
(4, 'What fear are you ready to release?', 'growth', 1),
(5, 'Who in your life deserves more gratitude? Why?', 'gratitude', 1),
(6, 'What does your ideal day look like, in vivid detail?', 'dream', 1),
(7, 'What challenge recently taught you something valuable?', 'challenge', 1),
(8, 'If your emotions today had a color, what would it be?', 'reflection', 1),
(9, 'What is one small thing you can do tomorrow to feel better?', 'growth', 1),
(10, 'Write about a place that makes you feel safe and calm.', 'reflection', 1),
(11, 'What are you avoiding that you know you shouldn\'t?', 'growth', 1),
(12, 'List 5 things your body did today that you can be grateful for.', 'gratitude', 1),
(13, 'What story are you telling yourself that might not be true?', 'reflection', 1),
(14, 'Describe your current mental state as a weather pattern.', 'reflection', 1),
(15, 'What would you do if you knew you couldn\'t fail?', 'dream', 1),
(16, 'What habit is serving you well right now?', 'growth', 1),
(17, 'When did you last feel genuinely proud of yourself?', 'reflection', 1),
(18, 'What does rest mean to you, beyond just sleep?', 'reflection', 1),
(19, 'Who inspires you most and what quality do you admire in them?', 'gratitude', 1),
(20, 'Write a letter to your future self, 1 year from now.', 'dream', 1),
(21, 'What made you smile unexpectedly today?', 'gratitude', 1),
(22, 'What is one thing you would tell your past self?', 'reflection', 1),
(23, 'Describe a moment today where you felt fully present.', 'reflection', 1),
(24, 'What fear are you ready to release?', 'growth', 1),
(25, 'Who in your life deserves more gratitude? Why?', 'gratitude', 1),
(26, 'What does your ideal day look like, in vivid detail?', 'dream', 1),
(27, 'What challenge recently taught you something valuable?', 'challenge', 1),
(28, 'If your emotions today had a color, what would it be?', 'reflection', 1),
(29, 'What is one small thing you can do tomorrow to feel better?', 'growth', 1),
(30, 'Write about a place that makes you feel safe and calm.', 'reflection', 1),
(31, 'What are you avoiding that you know you shouldn\'t?', 'growth', 1),
(32, 'List 5 things your body did today that you can be grateful for.', 'gratitude', 1),
(33, 'What story are you telling yourself that might not be true?', 'reflection', 1),
(34, 'Describe your current mental state as a weather pattern.', 'reflection', 1),
(35, 'What would you do if you knew you couldn\'t fail?', 'dream', 1),
(36, 'What habit is serving you well right now?', 'growth', 1),
(37, 'When did you last feel genuinely proud of yourself?', 'reflection', 1),
(38, 'What does rest mean to you, beyond just sleep?', 'reflection', 1),
(39, 'Who inspires you most and what quality do you admire in them?', 'gratitude', 1),
(40, 'Write a letter to your future self, 1 year from now.', 'dream', 1),
(41, 'What made you smile unexpectedly today?', 'gratitude', 1),
(42, 'What is one thing you would tell your past self?', 'reflection', 1),
(43, 'Describe a moment today where you felt fully present.', 'reflection', 1),
(44, 'What fear are you ready to release?', 'growth', 1),
(45, 'Who in your life deserves more gratitude? Why?', 'gratitude', 1),
(46, 'What does your ideal day look like, in vivid detail?', 'dream', 1),
(47, 'What challenge recently taught you something valuable?', 'challenge', 1),
(48, 'If your emotions today had a color, what would it be?', 'reflection', 1),
(49, 'What is one small thing you can do tomorrow to feel better?', 'growth', 1),
(50, 'Write about a place that makes you feel safe and calm.', 'reflection', 1),
(51, 'What are you avoiding that you know you shouldn\'t?', 'growth', 1),
(52, 'List 5 things your body did today that you can be grateful for.', 'gratitude', 1),
(53, 'What story are you telling yourself that might not be true?', 'reflection', 1),
(54, 'Describe your current mental state as a weather pattern.', 'reflection', 1),
(55, 'What would you do if you knew you couldn\'t fail?', 'dream', 1),
(56, 'What habit is serving you well right now?', 'growth', 1),
(57, 'When did you last feel genuinely proud of yourself?', 'reflection', 1),
(58, 'What does rest mean to you, beyond just sleep?', 'reflection', 1),
(59, 'Who inspires you most and what quality do you admire in them?', 'gratitude', 1),
(60, 'Write a letter to your future self, 1 year from now.', 'dream', 1);

-- --------------------------------------------------------

--
-- Structure de la table `journal_entries`
--

CREATE TABLE `journal_entries` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` longtext NOT NULL,
  `entry_type` enum('reflection','thought','gratitude','dream','goal') DEFAULT 'thought',
  `mood_id` int(11) DEFAULT NULL,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `prompt_used` varchar(255) DEFAULT NULL,
  `word_count` int(11) DEFAULT 0,
  `is_pinned` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `journal_entries`
--

INSERT INTO `journal_entries` (`id`, `user_id`, `title`, `content`, `entry_type`, `mood_id`, `tags`, `prompt_used`, `word_count`, `is_pinned`, `created_at`, `updated_at`) VALUES
(1, 3, 'hello', 'blahouiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii hjf hv fjjv jv y iyv jv jvjyvyv yvjyvjy vyvjyv yj y  y y y y y   y  y y y y y y y y y y y y y y y y y y y y y y y y y y  y y y y y yy', 'goal', NULL, '[\"growth\",\"spirituality\",\"money\"]', '', 51, 0, '2026-03-31 17:48:17', '2026-03-31 17:48:17'),
(2, 3, 'Gratitude — 3/31/2026', '1. bl\n2. kh\n3. lhc', 'gratitude', NULL, '[\"gratitude\"]', '', 6, 0, '2026-03-31 17:49:16', '2026-03-31 17:49:16'),
(3, 4, '', 'Sometimes I think about how strange it is that a moment can feel so full and yet so empty at the same time, like sitting in a place you’ve never been before but somehow recognizing the silence as if it belongs to you. I notice small things a lot, like the way light hits a surface or how people pause before answering questions, as if they’re choosing which version of themselves to present, and it makes me wonder how many versions of us exist in parallel without ever meeting. There are days when everything feels clear and organized, like a clean desk ready for something meaningful to happen, and then there are other days where thoughts overlap and blur into each other, not necessarily bad, just unfinished, like sentences that never quite reach their point. I think about time often, not in a deep philosophical way, but more like a background noise, always moving, always taking something with it, even if you don’t notice right away. Sometimes I imagine conversations I’ll never have, or replay ones I already did, slightly changing words, tones, outcomes, as if I’m editing a version of reality that only exists in my head. It’s not about regret, more like curiosity about possibilities that were close but never real. I also find it interesting how certain places or songs can suddenly unlock entire moods or memories without warning, like hidden doors that only open under the right conditions. There’s something comforting in that unpredictability, even if it doesn’t always make sense. I don’t always try to understand everything anymore; some thoughts are better left incomplete, like sketches instead of finished drawings. They feel more honest that way, less forced. And maybe that’s enough sometimes, just letting thoughts exist without needing to organize or explain them, like clouds passing by without asking where they’re going.', 'reflection', NULL, '[\"health\",\"spirituality\",\"growth\"]', 'What story are you telling yourself that might not be true?', 319, 0, '2026-04-03 20:08:21', '2026-04-03 20:08:21'),
(4, 5, '', 'ljhgfvdg:j', 'dream', NULL, '[\"hope\",\"grief\",\"relationships\",\"gratitude\"]', 'List 5 things your body did today that you can be grateful for.', 2, 0, '2026-04-22 09:13:11', '2026-04-22 09:13:11');

-- --------------------------------------------------------

--
-- Structure de la table `mood_logs`
--

CREATE TABLE `mood_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `mood_score` tinyint(4) NOT NULL COMMENT '1-10 scale',
  `mood_label` varchar(30) NOT NULL,
  `mood_emoji` varchar(10) DEFAULT NULL,
  `energy_level` tinyint(4) DEFAULT 5 COMMENT '1-10',
  `anxiety_level` tinyint(4) DEFAULT 5 COMMENT '1-10',
  `note` text DEFAULT NULL,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `logged_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `mood_logs`
--

INSERT INTO `mood_logs` (`id`, `user_id`, `mood_score`, `mood_label`, `mood_emoji`, `energy_level`, `anxiety_level`, `note`, `tags`, `logged_at`) VALUES
(1, 1, 4, 'Meh', '😕', 3, 6, '', '[\"family\",\"health\",\"social\"]', '2026-03-30 17:59:31'),
(2, 2, 4, 'Meh', '😕', 4, 3, '', '[\"social\",\"creative\",\"tired\",\"bored\"]', '2026-03-31 09:58:38'),
(3, 3, 5, 'Neutral', '😐', 5, 3, '', '[]', '2026-03-31 17:47:19'),
(4, 3, 10, 'Ecstatic', '🔥', 10, 8, '', '[\"work\",\"social\"]', '2026-03-31 17:48:40'),
(5, 4, 7, 'Good', '😊', 10, 4, 'im feeling bonita', '[\"social\",\"creative\",\"peaceful\"]', '2026-04-03 19:59:35'),
(6, 5, 8, 'Happy', '😄', 7, 10, '', '[\"tired\",\"social\"]', '2026-04-08 18:29:35'),
(7, 5, 6, 'Okay', '🙂', 7, 5, '', '[]', '2026-04-22 09:12:27');

-- --------------------------------------------------------

--
-- Structure de la table `sanctuary_sessions`
--

CREATE TABLE `sanctuary_sessions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `sound_type` varchar(50) DEFAULT NULL,
  `focus_duration` int(11) DEFAULT NULL COMMENT 'in minutes',
  `completed` tinyint(1) DEFAULT 0,
  `session_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `avatar_color` varchar(7) DEFAULT '#6C63FF',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_login` timestamp NULL DEFAULT NULL,
  `streak_count` int(11) DEFAULT 0,
  `total_entries` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `avatar_color`, `created_at`, `last_login`, `streak_count`, `total_entries`) VALUES
(1, 'makram', 'makrammbarki82@gmail.com', '$2y$12$4ELairN6tQZPBcSs2/XzX.JQN2IdLUwe.GQUVkI6LUxo9pj3lCVca', '#FFE66D', '2026-03-30 17:50:00', '2026-03-31 15:03:37', 1, 1),
(2, 'loujaine1411_', 'loujainedh@gmail.com', '$2y$12$K3ShH7l5YPE0p/3ltAJhEe3wcsgzS4.QycCW8uzZkiVNDDKy9iA6u', '#A8E6CF', '2026-03-31 09:57:50', NULL, 1, 1),
(3, 'makram123', 'ml@gmail.com', '$2b$12$6c7Fg/Mv8ks8K.yDxsprT.ND4kHd2Gk15NJvXj7jEQDvrEYQIejvi', '#7c6fff', '2026-03-31 17:47:08', '2026-03-31 17:47:09', 1, 1),
(4, 'mkrm', 'mkrm@gmail.com', '$2y$12$qPi3End6Bob/iCQKGZ/fduQOEgjWHqSWdiQhrnoKV9Of1x/u2zNHO', '#FF8B94', '2026-04-03 19:58:31', NULL, 1, 1),
(5, 'mkrmmm', 'mlkj@gmail.com', '$2y$12$ag03ZV89HazOwLLu05Kmt.HL8OEVJRQmqeXIzRFtBDCSbsPdQm4xa', '#FFE66D', '2026-04-08 18:28:42', '2026-04-22 09:12:07', 1, 2);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `achievements`
--
ALTER TABLE `achievements`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_achievement` (`user_id`,`achievement_key`);

--
-- Index pour la table `breathing_sessions`
--
ALTER TABLE `breathing_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `daily_prompts`
--
ALTER TABLE `daily_prompts`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `journal_entries`
--
ALTER TABLE `journal_entries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mood_id` (`mood_id`),
  ADD KEY `idx_user` (`user_id`);
ALTER TABLE `journal_entries` ADD FULLTEXT KEY `ft_content` (`title`,`content`);

--
-- Index pour la table `mood_logs`
--
ALTER TABLE `mood_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_date` (`user_id`,`logged_at`);

--
-- Index pour la table `sanctuary_sessions`
--
ALTER TABLE `sanctuary_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `achievements`
--
ALTER TABLE `achievements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `breathing_sessions`
--
ALTER TABLE `breathing_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `daily_prompts`
--
ALTER TABLE `daily_prompts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT pour la table `journal_entries`
--
ALTER TABLE `journal_entries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `mood_logs`
--
ALTER TABLE `mood_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `sanctuary_sessions`
--
ALTER TABLE `sanctuary_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `achievements`
--
ALTER TABLE `achievements`
  ADD CONSTRAINT `achievements_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `breathing_sessions`
--
ALTER TABLE `breathing_sessions`
  ADD CONSTRAINT `breathing_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `journal_entries`
--
ALTER TABLE `journal_entries`
  ADD CONSTRAINT `journal_entries_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `journal_entries_ibfk_2` FOREIGN KEY (`mood_id`) REFERENCES `mood_logs` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `mood_logs`
--
ALTER TABLE `mood_logs`
  ADD CONSTRAINT `mood_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `sanctuary_sessions`
--
ALTER TABLE `sanctuary_sessions`
  ADD CONSTRAINT `sanctuary_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
