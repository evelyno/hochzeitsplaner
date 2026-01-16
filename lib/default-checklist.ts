// Default checklist items for new events
export const DEFAULT_CHECKLIST_ITEMS = [
    // 12-10 Monate vorher
    { category: "12_10_MONTHS", order: 1, description: "Budget festlegen" },
    { category: "12_10_MONTHS", order: 2, description: "Groben Stil/Art der Hochzeit festlegen (Location, Größe, Motto)" },
    { category: "12_10_MONTHS", order: 3, description: "Gästeliste (grob) erstellen" },
    { category: "12_10_MONTHS", order: 4, description: "Wunschtermin + Alternativtermine festlegen" },
    { category: "12_10_MONTHS", order: 5, description: "Location(s) besichtigen & buchen" },
    { category: "12_10_MONTHS", order: 6, description: "Standesamt / Kirche / freie Trauung anfragen & Termin sichern" },
    { category: "12_10_MONTHS", order: 7, description: "Fotograf:in / Videograf:in buchen" },
    { category: "12_10_MONTHS", order: 8, description: "DJ/Band buchen" },

    // 9-7 Monate vorher
    { category: "9_7_MONTHS", order: 1, description: "Caterer/Restaurant fixieren (falls nicht über Location)" },
    { category: "9_7_MONTHS", order: 2, description: "Trauredner:in buchen (bei freier Trauung)" },
    { category: "9_7_MONTHS", order: 3, description: "Hochzeitskleid/Anzug aussuchen & bestellen" },
    { category: "9_7_MONTHS", order: 4, description: "Save-the-Date (bei weiter Anreise) versenden" },
    { category: "9_7_MONTHS", order: 5, description: "Grobe Tagesplanung erstellen" },
    { category: "9_7_MONTHS", order: 6, description: "Deko-/Floristik-Konzept starten" },
    { category: "9_7_MONTHS", order: 7, description: "Floristik anfragen" },
    { category: "9_7_MONTHS", order: 8, description: "Torte anfragen" },
    { category: "9_7_MONTHS", order: 9, description: "Styling (Hair/Make-up) anfragen" },
    { category: "9_7_MONTHS", order: 10, description: "Kinderbetreuung anfragen (optional)" },

    // 6-5 Monate vorher
    { category: "6_5_MONTHS", order: 1, description: "Einladungen gestalten/bestellen" },
    { category: "6_5_MONTHS", order: 2, description: "Trauzeug:innen & wichtige Helfer festlegen" },
    { category: "6_5_MONTHS", order: 3, description: "Eheringe aussuchen/bestellen" },
    { category: "6_5_MONTHS", order: 4, description: "Hotels/Unterkünfte für Gäste reservieren (Kontingent)" },
    { category: "6_5_MONTHS", order: 5, description: "Transport planen (Auto, Shuttle, etc.)" },
    { category: "6_5_MONTHS", order: 6, description: "Menü + Getränke besprechen" },
    { category: "6_5_MONTHS", order: 7, description: "Hochzeitstorte/Sweet Table planen" },
    { category: "6_5_MONTHS", order: 8, description: "Musik-Wünsche sammeln (Party/Trauung)" },

    // 4-3 Monate vorher
    { category: "4_3_MONTHS", order: 1, description: "Einladungen verschicken" },
    { category: "4_3_MONTHS", order: 2, description: "Brautkleid: erste Anprobe / Änderungen starten" },
    { category: "4_3_MONTHS", order: 3, description: "Styling-Probetermin vereinbaren" },
    { category: "4_3_MONTHS", order: 4, description: "Dekoration final planen + bestellen/mieten" },
    { category: "4_3_MONTHS", order: 5, description: "Ablaufplan detaillieren (Trauung, Sektempfang, Dinner, Party)" },
    { category: "4_3_MONTHS", order: 6, description: "Programmpunkte abstimmen (Reden, Spiele, Überraschungen)" },
    { category: "4_3_MONTHS", order: 7, description: "Trauung vorbereiten (Lieder, Texte, Rituale)" },
    { category: "4_3_MONTHS", order: 8, description: "Ehevorbereitungsgespräch (kirchlich, falls nötig)" },

    // 2 Monate vorher
    { category: "2_MONTHS", order: 1, description: "Rückmeldungen der Gäste nachhalten" },
    { category: "2_MONTHS", order: 2, description: "Sitzplan vorbereiten" },
    { category: "2_MONTHS", order: 3, description: "Finales Gespräch mit Location/Caterer (Ablauf + Zeiten)" },
    { category: "2_MONTHS", order: 4, description: "Gastgeschenke planen/bestellen (optional)" },
    { category: "2_MONTHS", order: 5, description: "Notfallset zusammenstellen (Blasenpflaster, Nähset etc.)" },
    { category: "2_MONTHS", order: 6, description: "Dokumente prüfen (Ausweise, Geburtsurkunden, Anmeldung Standesamt)" },

    // 4-2 Wochen vorher
    { category: "4_2_WEEKS", order: 1, description: "Finale Gästeanzahl an Location/Caterer melden" },
    { category: "4_2_WEEKS", order: 2, description: "Sitzplan finalisieren + Tischkarten erstellen" },
    { category: "4_2_WEEKS", order: 3, description: "Letzte Anprobe Kleid / Anzug" },
    { category: "4_2_WEEKS", order: 4, description: "Eheringe abholen" },
    { category: "4_2_WEEKS", order: 5, description: "Dienstleister final briefen (Zeitplan, Adressen, Ansprechpartner)" },
    { category: "4_2_WEEKS", order: 6, description: "Playlist/Partyablauf mit DJ/Band abstimmen" },
    { category: "4_2_WEEKS", order: 7, description: "Wetter-Plan B (bei Outdoor) festlegen" },
    { category: "4_2_WEEKS", order: 8, description: "Trinkgeld-Umschläge vorbereiten" },

    // 1 Woche vorher
    { category: "1_WEEK", order: 1, description: "Deko/Kleinteile sortieren & packen (Kisten beschriften!)" },
    { category: "1_WEEK", order: 2, description: "Ablaufplan ausdrucken (für Dienstleister + Trauzeugen)" },
    { category: "1_WEEK", order: 3, description: "Beauty: Nägel, Haare färben etc." },
    { category: "1_WEEK", order: 4, description: "Probe (Trauung/Einzug) falls möglich" },
    { category: "1_WEEK", order: 5, description: "Koffer packen (für Hochzeitsnacht / Flitterwochen)" },
    { category: "1_WEEK", order: 6, description: "Cash + Ausweise + Ringe sichern" },

    // 1 Tag vorher
    { category: "1_DAY", order: 1, description: "Location checken / ggf. dekorieren" },
    { category: "1_DAY", order: 2, description: "Blumen abholen/liefern lassen" },
    { category: "1_DAY", order: 3, description: "Outfits bügeln, Schuhe einlaufen" },
    { category: "1_DAY", order: 4, description: "Handy laden, Notfallset bereit" },
    { category: "1_DAY", order: 5, description: "Früh schlafen 😄" },

    // Hochzeitstag
    { category: "WEDDING_DAY", order: 1, description: "Frühstück + genug trinken" },
    { category: "WEDDING_DAY", order: 2, description: "Getting Ready (Puffer einplanen)" },
    { category: "WEDDING_DAY", order: 3, description: "Ringe, Dokumente, Gelübde nicht vergessen" },
    { category: "WEDDING_DAY", order: 4, description: "Trauzeug:innen/Planer:in als Ansprechpartner festlegen" },
    { category: "WEDDING_DAY", order: 5, description: "Genießen 💛" },

    // Nach der Hochzeit
    { category: "AFTER_WEDDING", order: 1, description: "Geschenke & Karten sichern" },
    { category: "AFTER_WEDDING", order: 2, description: "Dienstleister bewerten" },
    { category: "AFTER_WEDDING", order: 3, description: "Dankeskarten verschicken" },
    { category: "AFTER_WEDDING", order: 4, description: "Fotos auswählen & Album gestalten" },
    { category: "AFTER_WEDDING", order: 5, description: "Namensänderung / Dokumente (optional)" },
    { category: "AFTER_WEDDING", order: 6, description: "Abrechnung final machen" },
]

export const CATEGORY_LABELS: Record<string, string> = {
    "12_10_MONTHS": "12–10 Monate vorher",
    "9_7_MONTHS": "9–7 Monate vorher",
    "6_5_MONTHS": "6–5 Monate vorher",
    "4_3_MONTHS": "4–3 Monate vorher",
    "2_MONTHS": "2 Monate vorher",
    "4_2_WEEKS": "4–2 Wochen vorher",
    "1_WEEK": "1 Woche vorher",
    "1_DAY": "1 Tag vorher",
    "WEDDING_DAY": "Hochzeitstag",
    "AFTER_WEDDING": "Nach der Hochzeit",
    "GENERAL": "Allgemein"
}
