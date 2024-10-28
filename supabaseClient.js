// supabaseClient.js

// Informations pour la première base de données
const SUPABASE_URL_ETUDIANTS = 'https://rmidxaibwmvbmtxpubgv.supabase.co'; // Remplacez par l'URL de la première base de données
const SUPABASE_ANON_KEY_ETUDIANTS = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtaWR4YWlid212Ym10eHB1Ymd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY4NDczODEsImV4cCI6MjA0MjQyMzM4MX0.pj54J6XB1xcEbZJETypCttJEr9vnm6JDoUfwz2TV_F4';

// Création des clients Supabase pour chaque base de données
const supabaseEtudiants = supabase.createClient(SUPABASE_URL_ETUDIANTS, SUPABASE_ANON_KEY_ETUDIANTS);
