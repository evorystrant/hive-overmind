import * as express from 'express';
import * as passport from 'passport';
import JWT from '../Authentication/JWT';
import User from '../Models/users';

let router = express.Router();

router
    .route(`/usuarios/`)
    .get(   passport.authenticate('jwt', { session: false }),
            JWT.authorizeTo(false, 1),
            async (req, res) => { return res.json(await User.getUsers()) });

router
    .route(`/usuario/:id/`)
    .get(passport.authenticate('JWT', { session: false }),
        JWT.authorizeTo(true, 1, 2),
        async (req, res) => { return await User.getUser(Number.parseInt(req.params.id)); })
    .post(passport.authenticate(`JWT`, { session: false }),
        JWT.authorizeTo(false, 1, 2),
        (req, res) => { User.newFromQuery(req.body).createUser(); res.json({ response: `ok` }) })
    .put(passport.authenticate(`JWT`, { session: false }),
        JWT.authorizeTo(false, 1, 2),
        (req, res) => { User.newFromQuery(req.body).updateUser(Number.parseInt(req.param(`id`, `-1`))); res.json({ response: `ok` }) })
    .delete(passport.authenticate(`JWT`, { session: false }),
        JWT.authorizeTo(false, 1, 2),
        (req, res) => { User.deleteUser(Number.parseInt(req.param(`id`, `-1`))); res.json({ response: `ok` }) });

export default router;

