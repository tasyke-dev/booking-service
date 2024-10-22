import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import ServiceList from '../views/ServiceList.vue';
import BookingService from '../views/BookingService.vue';
import UserRegister from '../views/UserRegister.vue';
import UserLogin from '../views/UserLogin.vue';
import AdminPanel from '../views/AdminPanel.vue';
import { auth } from '../firebase'; // Импортируем auth для проверки состояния аутентификации
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/services',
    name: 'Services',
    component: ServiceList,
  },
  {
    path: '/booking/:id',
    name: 'Booking',
    component: BookingService,
    props: true,
    meta: { requiresAuth: true }, // Защищенный маршрут
  },
  {
    path: '/register',
    name: 'Register',
    component: UserRegister,
  },
  {
    path: '/login',
    name: 'Login',
    component: UserLogin,
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminPanel,
    meta: { requiresAuth: true, requiresAdmin: true }, // Защищенный маршрут
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Проверяем аутентификацию перед переходом
router.beforeEach(async (to, from, next) => {
  const isAuthenticated = !!auth.currentUser; 
  let isAdmin = false;

  console.log('Проверка аутентификации:', isAuthenticated);

  if (isAuthenticated) {
    const db = getFirestore();
    const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));

    if (userDoc.exists()) {
      const userData = userDoc.data();
      isAdmin = userData.role === 'admin';
      console.log('Роль пользователя:', userData.role); 
    } else {
      console.log('Документ пользователя не найден');
    }
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresAdmin && !isAdmin) {
    console.log('Доступ к админ панели запрещен');
    next('/'); 
  } else {
    next(); 
  }
});

export default router;
