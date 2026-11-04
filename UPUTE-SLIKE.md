# Slike članaka

## Zamjena slike za FSB bez Codexa
1. Otvori https://github.com/Web99-web/jobly.work/tree/main/images/dogadjanja
2. Odaberi Add file → Upload files.
3. Prenesi svoju sliku pod točnim nazivom `fsb-dani-karijera-2026-foto.jpg` i potvrdi Commit changes. Datoteka mora stvarno biti JPEG, preporučeno 1200 × 630 px. Promjena nastavka datoteke nije pretvorba.
4. Pričekaj završetak GitHub Pages objave. Ista slika koristi se na kartici Događanja, vrhu članka i u metapodacima za dijeljenje.
5. U https://developers.facebook.com/tools/debug/ zalijepi https://jobly.work/hr/dogadjanja/dani-karijera-fsb-2026/ i odaberi Scrape Again. Facebook određuje konačan prikaz i može zadržati staru sliku; postojeće objave ne moraju se osvježiti.

Trenutna fotografija: Penn State, Fall Career Days (2019.), https://commons.wikimedia.org/wiki/File:Fall_Career_Days.png — CC BY-SA 4.0, https://creativecommons.org/licenses/by-sa/4.0/. Izrezana na 1200 × 630 i komprimirana u JPEG; prilagođena fotografija također je pod CC BY-SA 4.0. Ilustrativna je, nije snimljena na FSB-u. Pri zamjeni fotografije ažuriraj autora, licencu i dimenzije u HTML-u.

## Novi članci
Stranica je statički HTML, bez CMS-a i bez automatskog povezivanja novih slika. Sam upload nove slike ne stvara članak. Za svaki novi članak dodaj datoteku slike i postavi njezinu putanju u `img src` u članku i kartici rubrike, te punu HTTPS adresu u `og:image` i `twitter:image` u HTML headu članka. Prilagodi naslov, opis, canonical, og:url, dimenzije i alternativni tekst. Klase `article-cover` i `card-cover` već podržavaju prikaz.

## Obavezna optimizacija prije svake objave
Svaku fotografiju smanjiti prije prijenosa: za naslovnu/OG cilj je 1200 × 630 px, JPEG odgovarajuće kvalitete (ili WebP uz JPEG za OG). Ciljajte ispod 200 KB uz provjeru čitljivosti i kvalitete; jednostavne fotografije mogu biti znatno manje. Ne prenositi višemegabajtne originale. Ukloniti nepotrebne metapodatke i provjeriti da sve kartice i OG oznake koriste optimiziranu datoteku. Za zamjenu slike u već podijeljenom članku koristiti novu adresu i osvježiti Facebook predmemoriju.

Fotografija mirovinskog članka: Ivan S / Pexels, https://www.pexels.com/photo/an-elderly-woman-using-laptop-inside-the-office-7394566/, https://www.pexels.com/license/. Izrezana i komprimirana, ilustrativna.
