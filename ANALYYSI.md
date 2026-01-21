# ANALYYSI.md

## 1. Mitä tekoäly teki hyvin?

Tekoäly auttoi nopeasti luomaan toimivan perusrakenteen projektille. Se:

- loi selkeän projektirakenteen (reitit, palvelut, mallit, in-memory store)
- toteutti kaikki vaaditut API-toiminnot:
  - varauksen luonti
  - varauksen peruutus
  - varausten listaus huonekohtaisesti
- toteutti liiketoimintasäännöt oikein:
  - varaukset eivät mene päällekkäin
  - varausta ei voi luoda menneisyyteen
  - aloitusaika on ennen lopetusaikaa
- erotti reitit ja liiketoimintalogiikan toisistaan

Tekoäly oli hyvä “juniori-koodari”, joka tuotti nopeasti toimivan ratkaisun, jota pystyi lähteä parantamaan.

---

## 2. Mitä tekoäly teki huonosti?

Tekoälyn tuottamassa koodissa oli useita puutteita, jotka vaativat korjausta:

- Syötevalidointi oli aluksi puutteellista ja epäyhteensopivaa Zod v4:n kanssa  
  (esim. `required_error` ja `invalid_type_error`, joita Zod v4 ei tue)
- Virheviestit olivat geneerisiä ja epäselviä käyttäjälle  
  (esim. “expected string, received undefined”)
- Validointi palautti vain ensimmäisen virheen, vaikka syötteessä oli useita virheitä
- Virheenkäsittely oli liian yksinkertaista (pelkkiä `Error`-poikkeuksia)
- Tyyppiturvallisuus puuttui validointivirheiden käsittelyssä

---

## 3. Tärkeimmät parannukset, jotka tein ja miksi

Tein useita parannuksia, joilla koodista tuli selkeämpi, turvallisempi ja käyttäjäystävällisempi:

### 1. Ensimmäinen askel – vahva validointi Zodilla

AI tuotti alkuperäisen koodin ilman kunnollista tietojen validointi varauksen luomista varten. Ensimmäinen parannukseni oli ottaa käyttöön **Zod-kirjasto**, joka on TypeScript-ystävällinen:

- varmistaa, että kaikki vaaditut kentät (`roomId`, `startTime`, `endTime`) ovat mukana
- tarkistaa datatyypit automaattisesti
- päivämäärät validoidaan ISO-muodossa
- parantaa TypeScript-tyyppiturvallisuutta ja kehittäjäkokemusta

Tämä loi perustan luotettavalle ja turvalliselle API:lle.

### 2. Zod v4 -yhteensopiva validointi

Korvasin virheelliset Zod-ominaisuudet oikealla tavalla (`z.preprocess`), jotta:

- puuttuvat kentät saavat selkeät “is required” -virheet
- päivämäärät validoidaan ISO-muodossa
- vältetään geneeriset Zod-virheilmoitukset

---

### 3. Kaikkien validointivirheiden palauttaminen

Lisäsin erillisen validointifunktion, joka:

- palauttaa kaikki virheet kerralla
- antaa virheille kenttäkohtaiset viestit

Tämä parantaa API:n käytettävyyttä erityisesti frontend-kehityksessä.

---

### 4. Selkeä vastuunjako

- Validointi tapahtuu palvelukerroksessa
- Reitit käsittelevät vain HTTP-vastaukset
- Liiketoimintasäännöt pysyvät yhdessä paikassa

Tämä tekee koodista helpommin ylläpidettävän ja testattavan.

---

### 5. Parempi TypeScript-tyyppiturvallisuus

Lisäsin `ValidationError`-tyypin, jotta:

- validointivirheet ovat selkeästi tyypitettyjä
- virheenkäsittely on turvallisempaa ja ennustettavampaa
- koodi on helpompi ymmärtää ja laajentaa

---

## Yhteenveto

Tekoäly tuotti ratkaisulle pohjamallin, joka oli hyvä lähtökohta, mutta se vaati merkittävää tarkastelua ja parannuksia. Otin vastuun koodin laadusta, korjasin puutteet ja tein ratkaisusta selkeämmän, turvallisemman ja lähempänä oikeaa tuotantovalmiista koodia. Työskentely vastasi hyvin todellista tilannetta, jossa tekoäly toimii apulaisena ja kehittäjä tekee lopulliset tekniset päätökset.


