// Default checklist items with relative due dates (days before wedding)
// Negative numbers = days before wedding, positive = days after
export const defaultChecklistItems = [
    // 12+ Monate vorher
    { title: 'Budget festlegen', category: '12_MONTHS', order: 1, daysBeforeWedding: 365 },
    { title: 'Hochzeitsdatum wählen', category: '12_MONTHS', order: 2, daysBeforeWedding: 365 },
    { title: 'Location besichtigen und buchen', category: '12_MONTHS', order: 3, daysBeforeWedding: 350 },
    { title: 'Gästeliste erstellen (erste Version)', category: '12_MONTHS', order: 4, daysBeforeWedding: 340 },
    { title: 'Hochzeitsplaner engagieren (optional)', category: '12_MONTHS', order: 5, daysBeforeWedding: 330 },

    // 9-12 Monate vorher
    { title: 'Brautkleid/Anzug aussuchen', category: '9_MONTHS', order: 1, daysBeforeWedding: 300 },
    { title: 'Fotograf buchen', category: '9_MONTHS', order: 2, daysBeforeWedding: 290 },
    { title: 'Videograf buchen (optional)', category: '9_MONTHS', order: 3, daysBeforeWedding: 290 },
    { title: 'Catering auswählen', category: '9_MONTHS', order: 4, daysBeforeWedding: 280 },
    { title: 'DJ/Band buchen', category: '9_MONTHS', order: 5, daysBeforeWedding: 270 },

    // 6-9 Monate vorher
    { title: 'Save-the-Date Karten verschicken', category: '6_MONTHS', order: 1, daysBeforeWedding: 240 },
    { title: 'Florist auswählen', category: '6_MONTHS', order: 2, daysBeforeWedding: 230 },
    { title: 'Hochzeitstorte bestellen', category: '6_MONTHS', order: 3, daysBeforeWedding: 220 },
    { title: 'Trauringe aussuchen', category: '6_MONTHS', order: 4, daysBeforeWedding: 210 },
    { title: 'Hochzeitswebsite erstellen', category: '6_MONTHS', order: 5, daysBeforeWedding: 200 },

    // 4-6 Monate vorher
    { title: 'Einladungen verschicken', category: '4_MONTHS', order: 1, daysBeforeWedding: 150 },
    { title: 'Brautkleid/Anzug Anprobe', category: '4_MONTHS', order: 2, daysBeforeWedding: 140 },
    { title: 'Dekoration planen', category: '4_MONTHS', order: 3, daysBeforeWedding: 130 },
    { title: 'Friseur/Make-up Artist buchen', category: '4_MONTHS', order: 4, daysBeforeWedding: 120 },
    { title: 'Hochzeitsreise buchen', category: '4_MONTHS', order: 5, daysBeforeWedding: 120 },

    // 2-4 Monate vorher
    { title: 'Menü finalisieren', category: '2_MONTHS', order: 1, daysBeforeWedding: 90 },
    { title: 'Sitzplan erstellen', category: '2_MONTHS', order: 2, daysBeforeWedding: 80 },
    { title: 'Playlist zusammenstellen', category: '2_MONTHS', order: 3, daysBeforeWedding: 75 },
    { title: 'Geschenktisch organisieren', category: '2_MONTHS', order: 4, daysBeforeWedding: 70 },
    { title: 'Trauzeugen Outfits koordinieren', category: '2_MONTHS', order: 5, daysBeforeWedding: 65 },

    // 1-2 Monate vorher
    { title: 'RSVP Deadline setzen', category: '1_MONTH', order: 1, daysBeforeWedding: 45 },
    { title: 'Finale Gästezahl an Caterer', category: '1_MONTH', order: 2, daysBeforeWedding: 40 },
    { title: 'Ablaufplan erstellen', category: '1_MONTH', order: 3, daysBeforeWedding: 35 },
    { title: 'Probedinner organisieren', category: '1_MONTH', order: 4, daysBeforeWedding: 30 },
    { title: 'Letzte Anprobe Brautkleid/Anzug', category: '1_MONTH', order: 5, daysBeforeWedding: 30 },

    // 2-4 Wochen vorher
    { title: 'Danksagungskarten vorbereiten', category: '2_WEEKS', order: 1, daysBeforeWedding: 21 },
    { title: 'Namenskarten schreiben', category: '2_WEEKS', order: 2, daysBeforeWedding: 18 },
    { title: 'Notfall-Kit packen', category: '2_WEEKS', order: 3, daysBeforeWedding: 14 },
    { title: 'Finale Besprechung mit Dienstleistern', category: '2_WEEKS', order: 4, daysBeforeWedding: 14 },
    { title: 'Trinkgelder vorbereiten', category: '2_WEEKS', order: 5, daysBeforeWedding: 10 },

    // 1 Woche vorher
    { title: 'Wettervorhersage checken', category: '1_WEEK', order: 1, daysBeforeWedding: 7 },
    { title: 'Ringe abholen', category: '1_WEEK', order: 2, daysBeforeWedding: 5 },
    { title: 'Packliste für Hochzeitstag erstellen', category: '1_WEEK', order: 3, daysBeforeWedding: 5 },
    { title: 'Gelübde schreiben/üben', category: '1_WEEK', order: 4, daysBeforeWedding: 4 },
    { title: 'Entspannen und genießen!', category: '1_WEEK', order: 5, daysBeforeWedding: 2 },

    // Tag vorher
    { title: 'Alle Dienstleister bestätigen', category: 'DAY_BEFORE', order: 1, daysBeforeWedding: 1 },
    { title: 'Notfall-Nummern zusammenstellen', category: 'DAY_BEFORE', order: 2, daysBeforeWedding: 1 },
    { title: 'Früh schlafen gehen', category: 'DAY_BEFORE', order: 3, daysBeforeWedding: 1 },

    // Nach der Hochzeit
    { title: 'Danksagungskarten verschicken', category: 'AFTER', order: 1, daysBeforeWedding: -14 },
    { title: 'Brautkleid reinigen lassen', category: 'AFTER', order: 2, daysBeforeWedding: -7 },
    { title: 'Namensänderung (falls gewünscht)', category: 'AFTER', order: 3, daysBeforeWedding: -30 },
]
