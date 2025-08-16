# Dokument wymagań produktu (PRD) - Training Organizer

## 1. Przegląd produktu

Training Organizer to webowe narzędzie do budowy i oceny planów treningowych dla trenerów personalnych i amatorów sportów siłowych. Produkt umożliwia tworzenie własnej bazy ćwiczeń z zamkniętą taksonomią, budowę planów w strukturze tydzień → dzień → pozycje oraz analizę planu przez model językowy (LLM). Interfejs użytkownika jest wyłącznie w języku polskim; produkt działa w przeglądarce (RWD).

Architektura docelowa: Frontend w Next.js (z SSR/middleware/server actions jako proxy) oraz osobny Backend (Node.js + Express.js + MongoDB). Analiza oraz generowanie krótkich opisów ćwiczeń wykorzystują LLM poprzez warstwę backendową z wbudowanymi guardrails.

Wersja MVP koncentruje się na: bazie ćwiczeń (CRUD, taksonomia, krótkie opisy AI), budowie planu (tydzień → dzień → pozycje), analizie planu przez LLM i zapisie raportu oraz minimalnym uwierzytelnianiu (e‑mail + hasło, reset hasła).

## 2. Problem użytkownika

Użytkownicy tracą czas na każdorazowe, ręczne wyszukiwanie ćwiczeń i układanie planów zgodnych z aktualną wiedzą. Brak jest szybkiej weryfikacji jakości planu, ryzyko powtórzeń i przeładowania określonych partii mięśniowych oraz niejednolitego poziomu merytorycznego opisów. Potrzebne jest proste narzędzie do katalogowania ćwiczeń, sprawnej konstrukcji planów i uzyskiwania krótkich, spójnych opisów wraz z obiektywną analizą planu.

## 3. Wymagania funkcjonalne

3.1. Baza ćwiczeń (CRUD)

- Pola danych ćwiczenia (MVP):
  - id (UUID/obiektowy identyfikator), nazwa [wymagane, 1–100 znaków], partiaGłówna [wymagane, ze słownika], podpartie[] [0..N ze słownika], ocenaES [wymagane, jedno z: E, D, C, B, A, S], opis [opcjonalny, ≤100 znaków, PL], isAiGenerated [bool], createdAt/updatedAt, createdBy.
- Taksonomia: jedna partia główna na ćwiczenie; wiele podpartii; słownik zamknięty (read‑only dla użytkownika, publikowany w repo i widoczny w aplikacji jako referencja).
- Operacje: dodaj, edytuj, usuń, podgląd szczegółów, lista.
- Walidacje: nazwa i ocenaES wymagane; partiaGłówna wymagana; opis jeśli istnieje to ≤100 znaków i język polski (weryfikacja heurystyczna); brak możliwości dodawania własnych tagów.

  3.2. Lista, filtrowanie i sortowanie ćwiczeń

- Filtry: nazwa (substring, case‑insensitive), partia główna (exact), podpartia (exact, dowolna z listy), ocenaES (exact, pojedyncza lub wielokrotny wybór).
- Sortowanie: po nazwie (A→Z/Z→A) oraz po ocenieES (E→S/S→E). Brak paginacji w MVP.
- Kombinacja filtrów działa koniunkcyjnie (AND).

  3.3. Generowanie krótkich opisów ćwiczeń (AI)

- Cel: krótki opis PL (maks. 100 znaków), styl przyjazny/profesjonalny, bez zbędnych dygresji.
- Guardrails: model otrzymuje twarde ograniczenia długości i tematu; backend i frontend walidują długość i podstawową adekwatność treści; w razie przekroczenia limitu odpowiedź jest odrzucana i proponowana jest ponowna generacja.
- Oznaczenie: opisy wygenerowane przez AI są flagowane; edycja przez użytkownika usuwa status „bez edycji”.
- Zdarzenia: generated, acceptedWithoutEdit (dla metryki 75%).

  3.4. Budowa planu treningowego

- Struktura: Plan → Tygodnie[] → Dni[] → Pozycje[].
- Pozycja: exerciseId [wymagane], serie [wymagane, liczba całkowita], powtórzenia [opcjonalne], przerwaSek [opcjonalne], RIR [opcjonalne], tempo [opcjonalne, np. 3‑1‑1‑0 lub X‑1‑1‑0].
- Walidacje zakresów: wartości muszą mieścić się w konfigurowalnych widełkach (domyślnie: serie 1–10, powtórzenia 1–30, przerwaSek 0–600, RIR 0–8; tempo wzorzec [\dX]-\d-\d-\d). Wartości i wzorce mogą zostać doprecyzowane bez zmiany kontraktu.
- Operacje: tworzenie/edycja/usuwanie planu, dodawanie/edycja/usuwanie pozycji, reorganizacja pozycji.

  3.5. Analiza planu przez LLM

- Zakres oceny: rozmieszczenie partii, zakresy serii/powtórzeń, przerwy, ryzyko przeładowania; wynik końcowy 1–10.
- Wynik: score1_10, kryteria oceny, krytycznePunkty[], rekomendacje[], cytowania[] (o ile model poda; format: autor, rok, link).
- Raport analizy musi być zapisywany i przypisywany do planu; plan przechowuje historię analiz.
- Guardrails AI: ograniczenie długości odpowiedzi, tematyki i próba dołączania cytowań; komunikaty ostrzegawcze w UI.
- Błędy: w razie braku odpowiedzi/cytowań lub timeoutu – czytelny komunikat i możliwość ponowienia.

  3.6. Raporty analiz i historia

- Każdy raport zapisany przy planie; lista raportów w widoku planu z datą, wynikiem i dostępem do szczegółów.
- Możliwość porównania trendu ocen na poziomie planu (min. lista z wynikami w czasie).

  3.7. Uwierzytelnianie i bezpieczeństwo dostępu

- Rejestracja: e‑mail + hasło; logowanie; wylogowanie; reset hasła przez link/hasło tymczasowe (bez weryfikacji e‑mail w MVP).
- Polityka hasła: min. 8 znaków, co najmniej 1 mała i 1 duża litera oraz 1 znak specjalny.
- Jeden typ konta użytkownika. Brak ról administracyjnych w MVP.

  3.8. Metryki i logowanie zdarzeń

- Metryka 75%: liczona globalnie od startu systemu; w liczniku wyłącznie opisy wygenerowane przez AI i zapisane bez edycji.
- Zdarzenia: ai.description.generated, ai.description.acceptedWithoutEdit.

  3.9. Język, RWD i dostępność

- Interfejs wyłącznie w języku polskim.
- RWD: kluczowe ścieżki działają na urządzeniach mobilnych i desktop.

  3.10. Kontrakty danych (szkic)

- Ćwiczenie:
  - { id, nazwa, partiaGłówna, podpartie[], ocenaES, opis?, isAiGenerated, createdAt, updatedAt }
- Plan i pozycje:
  - Plan: { id, nazwa, tygodnie[] }
  - Tydzień: { dni[] }
  - Dzień: { partie[] }
  - Partie: { nazwa, pozycje[] }
  - Pozycja: { exerciseId, serie, powtórzenia?, przerwaSek?, RIR?, tempo? }
- Raport analizy:
  - { id, planId, score1_10, kryteria, krytycznePunkty[], rekomendacje[], cytowania[], createdAt }
- LLM kontrakty (wejście/wyjście) zostaną dookreślone; w MVP obowiązuje schema powyżej (JSON) z rygorystyczną walidacją po stronie BE.

## 4. Granice produktu

Zakres poza MVP:

- Generowanie kompletnych planów od zera (end‑to‑end) przez AI.
- Import/eksport planów i danych, integracje zewnętrzne.
- Współdzielenie planów między użytkownikami i współpraca w czasie rzeczywistym.
- Dziennik treningowy (pomiary, wyniki, serie, powtórzenia, uwagi).
- Aplikacje mobilne natywne.
- Panel administracyjny oraz zaawansowana analityka produktu.
- Media (zdjęcia, wideo) oraz przechowywanie plików.
- Formalne NFR poza RWD (wydajność, SLO, compliance) – traktowane akademicko w MVP.

Ograniczenia przyjęte w MVP:

- Zamknięta taksonomia partii/podpartii; brak własnych tagów.
- Brak paginacji i fuzzy search; wyszukiwanie po nazwie substring case‑insensitive.
- Cytowania w analizie tylko jeśli model je zwróci.
- Język interfejsu wyłącznie PL.

Kwestie do doprecyzowania (nie blokują implementacji MVP):

- Finalizacja słownika partii i podpartii.
- Dokładne progi walidacji zakresów liczbowych i wzorców tempa.
- Ostateczny kontrakt z LLM (prompty, schemat odpowiedzi, polityka błędów i retry).
- Zasady oceny niekompletnych planów (kiedy błąd, a kiedy obniżenie punktacji i o ile).
- Wersjonowanie danych (czy przechowujemy rewizje ćwiczeń/planów/opisów AI).

## 5. Historyjki użytkowników

US-001
Tytuł: Rejestracja konta
Opis: Jako nowy użytkownik chcę utworzyć konto przy użyciu e‑maila i hasła, aby korzystać z aplikacji.
Kryteria akceptacji:

- Formularz przyjmuje e‑mail i hasło zgodne z polityką.
- Po poprawnym wypełnieniu konto zostaje utworzone, a użytkownik jest zalogowany lub przekierowany do logowania.
- Błędne dane wyświetlają czytelny komunikat.

US-002
Tytuł: Logowanie
Opis: Jako użytkownik chcę zalogować się do aplikacji, aby uzyskać dostęp do swoich danych.
Kryteria akceptacji:

- Poprawne dane logują użytkownika i ustawiają sesję.
- Niepoprawne dane zwracają komunikat o błędzie bez ujawniania, czy e‑mail istnieje.

US-003
Tytuł: Reset hasła
Opis: Jako użytkownik chcę zresetować hasło, gdy go zapomnę.
Kryteria akceptacji:

- Dostępny mechanizm resetu (mail/hasło tymczasowe) bez weryfikacji e‑mail w MVP.
- Nowe hasło musi spełniać politykę haseł.

US-004
Tytuł: Wylogowanie
Opis: Jako użytkownik chcę się wylogować, aby zakończyć sesję.
Kryteria akceptacji:

- Wylogowanie usuwa sesję i przekierowuje na ekran logowania lub stronę startową.

US-005
Tytuł: Zmiana hasła po zalogowaniu
Opis: Jako zalogowany użytkownik chcę zmienić swoje hasło zgodnie z polityką, aby zwiększyć bezpieczeństwo.
Kryteria akceptacji:

- Formularz wymaga podania starego i nowego hasła zgodnego z polityką.
- Po sukcesie użytkownik otrzymuje potwierdzenie.

US-006
Tytuł: Ochrona zasobów przed niezalogowanymi
Opis: Jako system chcę blokować dostęp do funkcji zarządzania ćwiczeniami i planami dla niezalogowanych użytkowników.
Kryteria akceptacji:

- Próba wejścia na chronione widoki przekierowuje do logowania.

US-010
Tytuł: Dodanie ćwiczenia
Opis: Jako użytkownik chcę dodać ćwiczenie z nazwą, partią główną i oceną E–S oraz opcjonalnymi polami.
Kryteria akceptacji:

- Wymagane pola: nazwa, partia główna, ocena E–S.
- Partia i podpartie wybierane wyłącznie ze słownika.
- Walidacja opisu: jeśli podany, to ≤100 znaków i po polsku.

US-011
Tytuł: Edycja ćwiczenia
Opis: Jako użytkownik chcę edytować dane ćwiczenia, w tym ocenę i opis.
Kryteria akceptacji:

- Edycja podlega tym samym walidacjom co tworzenie.
- Zmiana opisu AI usuwa status „bez edycji”.

US-012
Tytuł: Usunięcie ćwiczenia
Opis: Jako użytkownik chcę usunąć ćwiczenie, aby utrzymać porządek w bazie.
Kryteria akceptacji:

- Operacja wymaga potwierdzenia.
- W razie powiązań w planach użytkownik otrzymuje ostrzeżenie.

US-013
Tytuł: Podgląd listy ćwiczeń
Opis: Jako użytkownik chcę zobaczyć listę wszystkich ćwiczeń.
Kryteria akceptacji:

- Lista zawiera nazwę, partię główną, ocenę E–S i wskaźnik opisu.
- Brak paginacji w MVP.

US-014
Tytuł: Filtrowanie ćwiczeń
Opis: Jako użytkownik chcę filtrować listę po nazwie, kategorii, podkategorii i ocenie E–S.
Kryteria akceptacji:

- Filtrowanie po nazwie działa jako substring case‑insensitive.
- Kategoria/podkategoria i ocena E–S filtrują exact.
- Filtry łączą się koniunkcyjnie.

US-015
Tytuł: Sortowanie ćwiczeń
Opis: Jako użytkownik chcę sortować listę ćwiczeń po nazwie i ocenie E–S.
Kryteria akceptacji:

- Sortowanie rosnące/malejące dla obu pól.
- Sortowanie działa razem z filtrami.

US-016
Tytuł: Generowanie opisu ćwiczenia przez AI
Opis: Jako użytkownik chcę wygenerować krótki opis ćwiczenia w języku polskim.
Kryteria akceptacji:

- Opis ma maks. 100 znaków i jest w języku polskim.
- W razie przekroczenia limitu lub tematu odpowiedź jest odrzucona, z informacją i możliwością ponownej próby.
- Wygenerowany opis jest oznaczony jako AI‑generated.

US-017
Tytuł: Akceptacja opisu AI bez edycji
Opis: Jako użytkownik mogę zaakceptować opis AI bez edycji, co wpływa na metrykę 75%.
Kryteria akceptacji:

- Zdarzenie acceptedWithoutEdit jest logowane wyłącznie przy zapisie bez zmian.
- Edycja opisu przed zapisem nie zwiększa metryki.

US-018
Tytuł: Przegląd słownika partii i podpartii
Opis: Jako użytkownik chcę podejrzeć obowiązujący słownik, aby wybrać poprawne kategorie.
Kryteria akceptacji:

- Słownik jest dostępny z poziomu UI jako read‑only.
- Elementy słownika są jednoznaczne i wyszukiwalne po nazwie.

US-019
Tytuł: Podgląd szczegółów ćwiczenia
Opis: Jako użytkownik chcę zobaczyć szczegóły ćwiczenia, w tym opis i ocenę.
Kryteria akceptacji:

- Widok prezentuje wszystkie pola, w tym informację czy opis jest AI‑generated.

US-020
Tytuł: Utworzenie planu
Opis: Jako użytkownik chcę utworzyć plan treningowy, aby budować strukturę tygodni, dni i pozycji.
Kryteria akceptacji:

- Plan posiada nazwę i pustą strukturę do edycji.
- Plan zapisuje się z identyfikatorem i datą utworzenia.

US-021
Tytuł: Edycja struktury planu
Opis: Jako użytkownik chcę dodawać tygodnie, dni i pozycje oraz zmieniać ich układ.
Kryteria akceptacji:

- Dodawanie/usuwanie tygodni i dni.
- Reorganizacja pozycji w obrębie dnia.

US-022
Tytuł: Dodanie pozycji do planu
Opis: Jako użytkownik dodaję pozycję, wybierając ćwiczenie i ustawiając parametry.
Kryteria akceptacji:

- Wymagane: exerciseId, serie (liczba całkowita > 0 zgodnie z konfiguracją).
- Opcjonalne: powtórzenia, przerwaSek, RIR, tempo – jeśli podane, muszą przejść walidacje zakresów/wzorca.

US-023
Tytuł: Edycja i usuwanie pozycji
Opis: Jako użytkownik chcę edytować i usuwać pozycje w planie.
Kryteria akceptacji:

- Zmiany podlegają walidacjom jak przy dodawaniu.
- Usuwanie wymaga potwierdzenia.

US-024
Tytuł: Analiza planu przez AI
Opis: Jako użytkownik uruchamiam analizę planu i otrzymuję ocenę 1–10, krytyczne punkty, rekomendacje i ewentualne cytowania.
Kryteria akceptacji:

- Raport zawiera score1_10, kryteria, krytycznePunkty[], rekomendacje[], cytowania[] (jeśli zwrócone).
- Raport jest przypięty do planu i widoczny w historii analiz.
- W razie błędu/timeoutu otrzymuję komunikat i mogę ponowić próbę.

US-025
Tytuł: Historia analiz planu
Opis: Jako użytkownik chcę przeglądać historię raportów dla danego planu.
Kryteria akceptacji:

- Lista raportów z datą i wynikiem, możliwość otwarcia szczegółów.
- Brak paginacji w MVP.

US-026
Tytuł: Komunikaty ostrzegawcze i guardrails AI
Opis: Jako użytkownik widzę jasne ograniczenia i ostrzeżenia dotyczące treści generowanych przez AI.
Kryteria akceptacji:

- Komunikaty o ograniczeniach długości i tematyce są prezentowane w UI.
- W razie niespełnienia reguł odpowiedź nie jest zapisywana.

US-027
Tytuł: Obsługa błędów i ponawianie żądań AI
Opis: Jako użytkownik mogę ponowić generowanie opisu lub analizę po błędzie.
Kryteria akceptacji:

- Aplikacja prezentuje zrozumiały komunikat błędu.
- Dostępny jest przycisk ponów.

US-028
Tytuł: Responsywność interfejsu
Opis: Jako użytkownik korzystam z aplikacji na ekranach mobilnych i desktopowych.
Kryteria akceptacji:

- Kluczowe ścieżki (CRUD ćwiczeń, lista, budowa planu, analiza, logowanie) są używalne na wyświetlaczach mobilnych.

US-029
Tytuł: Bezpieczny dostęp i polityka haseł
Opis: Jako użytkownik chcę, aby dostęp do aplikacji był zabezpieczony podstawową polityką haseł.
Kryteria akceptacji:

- Rejestracja i zmiana/reset hasła egzekwują: min. 8 znaków, 1 mała i 1 duża litera, 1 znak specjalny.
- Hasła są przechowywane w sposób bezpieczny (hashowanie po stronie BE; szczegóły implementacyjne poza zakresem UI testów, ale weryfikowalne w kodzie i testach BE).

US-030
Tytuł: Język interfejsu wyłącznie PL
Opis: Jako użytkownik widzę cały interfejs i komunikaty w języku polskim.
Kryteria akceptacji:

- Brak przełączników językowych.
- Brak mieszania języków w komunikatach i opisach systemowych.

US-031
Tytuł: Analiza niekompletnego planu
Opis: Jako użytkownik otrzymuję jasny wynik, gdy plan jest niekompletny (błąd lub obniżona punktacja zgodnie z zasadami).
Kryteria akceptacji:

- Jeśli brakuje kluczowych danych pozycji (np. serie), analiza nie startuje i wyświetlany jest komunikat błędu.
- Jeśli plan jest formalnie kompletny, ale suboptymalny (np. braki parametrów opcjonalnych), analiza działa i może obniżyć ocenę.

US-032
Tytuł: Zmiana nazwy planu i usunięcie planu
Opis: Jako użytkownik chcę zmienić nazwę lub usunąć plan, aby utrzymać porządek.
Kryteria akceptacji:

- Zmiana nazwy zachowuje historię analiz.
- Usunięcie wymaga potwierdzenia i informuje o utracie historii analiz.

US-033
Tytuł: Lista planów
Opis: Jako użytkownik chcę zobaczyć listę swoich planów.
Kryteria akceptacji:

- Lista prezentuje nazwę, datę utworzenia i ostatnią ocenę (jeśli istnieje).

## 6. Metryki sukcesu

- 75% opisów ćwiczeń wygenerowanych przez AI bez edycji: licznik zdarzeń acceptedWithoutEdit / liczba wszystkich wygenerowanych opisów od startu systemu.
- Odsetek planów z oceną analizy co najmniej 8/10: raportowane na poziomie planu i w trendzie czasowym.
- Dyscyplina guardrails: 100% zapisanych opisów ≤100 znaków (walidacja po stronie FE/BE) i raporty zawierają cytowania, gdy model je zwróci.
- Adopcja funkcji: liczba utworzonych ćwiczeń, liczba planów, liczba analiz planów (metryki obserwacyjne, nie jako twarde kryteria MVP).
