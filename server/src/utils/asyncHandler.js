// Enveloppe un handler de route async : toute erreur qu'il lève, ou toute
// promesse qu'il rejette, est transmise à next(error) automatiquement.
// Express 4 ne le fait pas tout seul pour les fonctions async — sans ce
// wrapper, une erreur dans un contrôleur laisserait la requête sans
// réponse, au lieu de déclencher errorHandler.
export function asyncHandler(handler) {
    return (req, res, next) => {
        Promise.resolve(handler(req, res, next)).catch(next);
    };
}