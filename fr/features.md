---
title: Fonctionnalités Interactives
description: Démonstration des composants Markdown modernes et du rendu interactif dans VertiWiki.
---

# Fonctionnalités Interactives 🚀

VertiWiki enrichit le Markdown standard avec plus de 14 plugins intégrés et zéro dépendance lourde à l'exécution.

---

## 1. Encadrés d'Alerte (Callouts GFM)

> [!NOTE]
> Informations utiles et explications contextuelles.

> [!TIP]
> Recommandations de performance et meilleures pratiques d'ingénierie.

> [!IMPORTANT]
> Instructions fondamentales et étapes obligatoires.

> [!WARNING]
> Avertissements sur les changements majeurs ou ruptures de compatibilité.

> [!CAUTION]
> Actions à haut risque pouvant affecter vos données ou votre sécurité.

---

## 2. Onglets Interactifs (Tabs)

:::tabs
== TypeScript
```typescript
interface WikiConfig {
  title: string;
  locales?: LocaleConfig[];
}
```
== JSON
```json
{
  "title": "VertiWiki",
  "locales": [{ "code": "fr", "label": "Français" }]
}
```
:::

---

## 3. Formules Mathématiques (KaTeX)

Formule en ligne : $E = mc^2$ ou la série de Fourier :

$$f(x) = a_0 + \sum_{n=1}^{\infty} \left(a_n \cos\frac{n\pi x}{L} + b_n \sin\frac{n\pi x}{L}\right)$$
