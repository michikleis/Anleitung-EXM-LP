---
description: Anleitung zum Erstellen und Hochladen eines neuen Experiments
---

# Experiment Deployment Workflow

Benutze diesen Workflow, wenn du eine neue Version oder ein Experiment testen möchtest, ohne den Haupt-Code zu verändern.

1.  **Sicherstellen, dass alles sauber ist:**
    ```bash
    git status
    # Sollte "nothing to commit, working tree clean" sagen (oder nur unwichtige Änderungen)
    ```

2.  **Neuen Branch (Zweig) erstellen:**
    Gib dem Experiment einen Namen, z.B. `experiment-neue-farbe`:
    ```bash
    git checkout -b experiment-neue-farbe
    ```

3.  **Änderungen vornehmen:**
    Mache deine Änderungen am Code.

4.  **Speichern & Hochladen:**
    ```bash
    git add .
    git commit -m "Experiment: Beschreibung deiner Änderung"
    git push -u origin experiment-neue-farbe
    ```

5.  **In Netlify:**
    Netlify erkennt den neuen Branch oft automatisch und baut eine "Branch Deploy Preview" URL (z.B. `experiment-neue-farbe--dein-projekt.netlify.app`). So kannst du es testen, ohne die Live-Seite zu ändern.
