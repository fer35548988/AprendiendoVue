import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index.js'
/* 
CAMBIADO POR IMPORTS DINAMICOS 

import viewUsuariosLista from '../views/viewUsuariosLista.vue'
import viewLegal from '@/views/viewLegal.vue'
import viewContacto from '@/views/viewContacto.vue'
import viewUsuario from '@/views/viewUsuario.vue'
import usuarioInfo from '@/components/UsuarioInfo.vue'
import viewError404 from '@/views/viewError404.vue' 
*/
 

Vue.use(VueRouter)

  const routes = [
  {
    path: '*',
    name: 'Error404',
    //component: viewError404
    component: () => import(/* webpackChunkName: "Error404" */ "@/views/viewError404.vue")
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import( /* webpackChunkName: "Login" */ '@/views/viewLogin.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    /* DEFINO ESTA meta PARA INDICAR QUE LA RUTA REQUIERE DE QUE EL USUARIO ESTE AUTENTICADO PARA INGRESAR */
    meta: {
      requiereAuth: true
    },
    component: () => import( /* webpackChunkName: "Dashboard" */ '@/views/viewDashboard.vue')
  },
  /* 
    RUTA ESTATICA, CUANDO SE ENTRE A LA RUTA / SE VISUALIZA EL COMPONENTE viewUsuariosLista 
    QUE SE ENCARGAR DE RENDERIZAR EL RouterView
  */
  {
    /* CUANDO INGRESEMOS A LA RUTA / LO REDIRIGIRE A LA RUTA /usuarios */
    path: '/',
    redirect: {
      name: 'Home'
    }
  },
  {
    path: '/usuario',
    name: 'Home',
    /* APLICANDO LAZY LOAD Y CODE SPLITTING */
    // component: viewUsuariosLista
    component: () => import(/* webpackChunkName: "Home" */ "@/views/viewUsuariosLista.vue")
  },
  {
    path: '/legal',
    name: 'Legal',
    //component: viewLegal
    component: ()=> import( /* webpackChunkName: "Legal" */ "@/views/viewLegal.vue")
  },
  {
    path: '/contacto',
    name: 'Contacto',
    //component: viewContacto
    component: () => import( /* webpackChunkName: "Contacto" */ "@/views/viewContacto.vue")
  },
  /* 
    RUTA DINAMICA, CON EL :username INDICAMOS QUE ESTAMOS ESPERANDO UN VALOR DINAMICO 
  */
  {
    path: '/usuario/:username',
    name: 'Usuario',
    //component: viewUsuario,
    component: () => import( /* webpackChunkName: "viewUsuario" */ "@/views/viewUsuario.vue"),

    /* RUTA ANIDADAS */
    children: [
      /* POR CADA RUTA ANIDADA RECIBE UN OBJETO */
      {
        /*
          EL path DE ESTA RUTA ANIDADA QUEDARIA REPRESENTADA DE LA SIGUIENTE FORMA path: '/usuario/:username/info'
        */
        path: 'info',
        name: 'UsuarioInfo',
        //component: usuarioInfo,
        component: () => import( /* webpackChunkName: "UsuarioInfo" */ "@/components/UsuarioInfo.vue"),

        /* CON props:true INDICAMOS QUE EN EL COMPONENTE QUE SE VA A RENDERIZAR PODEMOS RECIBIR PROPIEDADES */
        props: true
      }
    ]
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

/* PARA DAR PROTECCIÓN DE MANERA GLOBAL A LAS RUTAS */
router.beforeEach((to, from, next) => {
  /*  
    VERIFICO SI LA RUTA HACIA DONDE ME DIRIJO TIENE LA META DE requiereAuth, 
    ESTA LA DEFINI PARA INDICAR QUE ESTA RUTA NECESITA DE ESTAR AUTENTIFICADO 
  */
  if (to.matched.some(record => record.meta.requiereAuth)) {
    /* SI LA RUTA NECESITA AUTENTIFICACION, ME FIJO EN LA STORE SI EL USUARIO ESTA AUTENTIFICADO */
    if (store.state.auth) {
      /* SI EL USUARIO ESTA AUTENTIFICADO LE DOY PERMISO PARA QUE SIGA PARA ADELANTE */
      next();
    } else {
      /* SI EL USUARIO NO ESTA AUTENTIFICADO, NO LE DOY PERMISO DE ACCEDER A LA RUTA Y LO REDIFIJO AL LOGIN */
      next({ name: "Login" });
    }
  /* 
    EN EL CASO DE QUE LA RUTA NO REQUIERE AUTENTIFICACION, ES DECIR QUE LA META DE requiereAuth NO 
    SE ENCUENTRE COMO REQUISITO EN LA RUTA, LO DEJO PASAR DIRECTAMENTE A LA RUTA QUE SE DIRIJE
  */
  } else {
    next();
  }
});

export default router
