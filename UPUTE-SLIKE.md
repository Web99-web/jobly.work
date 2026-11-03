# Slike članaka

## Zamjena slike za FSB bez Codexa
1. Otvori https://github.com/Web99-web/jobly.work/tree/main/images/dogadjanja
2. Odaberi Add file → Upload files.
3. Prenesi svoju sliku pod točnim nazivom `fsb-dani-karijera-2026-foto.png` i potvrdi Commit changes. Datoteka mora stvarno biti PNG, preporučeno 1200 × 630 px. Promjena nastavka JPG u PNG nije pretvorba.
4. Pričekaj završetak GitHub Pages objave. Ista slika koristi se na kartici Događanja, vrhu članka i u metapodacima za dijeljenje.
5. U https://developers.facebook.com/tools/debug/ zalijepi https://jobly.work/hr/dogadjanja/dani-karijera-fsb-2026/ i odaberi Scrape Again. Facebook određuje konačan prikaz i može zadržati staru sliku; postojeće objave ne moraju se osvježiti.

Trenutna fotografija: Penn State, Fall Career Days (2019.), https://commons.wikimedia.org/wiki/File:Fall_Career_Days.png — CC BY-SA 4.0, https://creativecommons.org/licenses/by-sa/4.0/. Preuzeta bez izmjene; CSS na webu prikazuje široki kadar. Ilustrativna je, nije snimljena na FSB-u. Pri zamjeni fotografije ažuriraj autora, licencu i dimenzije u HTML-u.

## Novi članci
Stranica je statički HTML, bez CMS-a i bez automatskog povezivanja novih slika. Sam upload nove slike ne stvara članak. Za svaki novi članak dodaj datoteku slike i postavi njezinu putanju u `img src` u članku i kartici rubrike, te punu HTTPS adresu u `og:image` i `twitter:image` u HTML headu članka. Prilagodi naslov, opis, canonical, og:url, dimenzije i alternativni tekst. Klase `article-cover` i `card-cover` već podržavaju prikaz.