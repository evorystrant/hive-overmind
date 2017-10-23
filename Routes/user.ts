import * as express from 'express';
import * as passport from 'passport';
import JWT from '../Authentication/JWT';
import User from '../Models/user';

let router = express.Router();

router
    .route(`/usuarios/`)
    .get(   passport.authenticate('jwt', { session: false }),
            JWT.authorizeTo(false, 1, 2),
            async (req, res) => { return res.json(await User.getAll()) })
    .post(passport.authenticate('jwt', { session: false }),
        JWT.authorizeTo(false, 1),
        async (req, res) => res.json(await User.find(req.param(`lookFor`, `~`))));

router
    .route(`/usuario/`)
    .post(passport.authenticate(`jwt`, { session: false }),
        JWT.authorizeTo(false, 1, 2),
        async (req, res) =>
            await User.deseliarize(req.body)
                .create()
                .catch(error => { console.log(error); res.status(400); res.send({ error: error }) })
                .then(result => res.json(result))
        )

router
    .route(`/usuario/:id/`)
    .get(passport.authenticate('jwt', { session: false }),
        JWT.authorizeTo(true, 1, 2),
        async (req, res) =>
            await User
                .get(Number.parseInt(req.params.id))
                .catch(error => { console.log(error); res.status(400).send(error) })
                .then(result => res.json(result))
    )
    .put(passport.authenticate(`jwt`, { session: false }),
        JWT.authorizeTo(false, 1, 2),
        async (req, res) =>
            await User.deseliarize(req.body)
                .update(Number.parseInt(req.params.id))
                .catch(error => { console.log(error); res.status(400).send(error) })
                .then(result => res.json(result))
    )
    .delete(passport.authenticate(`jwt`, { session: false }),
        JWT.authorizeTo(false, 1, 2),
        async (req, res) =>
            await User.delete(Number.parseInt(req.params.id))
                .catch(error => { console.log(error); res.status(400).send(error) })
                .then(result => res.json(result))
    )

export default router;

