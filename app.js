// app.js - SalaConnect Client-Side Controller (LocalStorage Version)

// Initialize the Mock DB in LocalStorage (loaded from mockData.js global window object)
window.initializeDB();

// Default Google Sheets Apps Script Web App URL (User can edit this directly in app.js)
const DEFAULT_GSHEET_URL = "https://script.google.com/macros/s/AKfycbwQeO7MvoDzbhCFk2M-O-JQpSORRG6ikWmWQJN1diekH_81zeZpgROerZcQmJpeKPYHJw/exec";

// Global App State
let state = {
  currentUser: null,
  currentLanguage: 'km', // 'km' or 'en'
  currentTheme: 'light', // 'light' or 'dark'
  activeView: 'dashboard',
  activeChatRecipient: null, // username or class group name
  notifications: [],
  syncInterval: null,
  lastKnownMessagesCount: null
};

// DOM Elements cache
const el = {
  authPage: document.getElementById('auth-page'),
  appContainer: document.getElementById('app-container'),
  authForm: document.getElementById('auth-form'),
  authSubmitBtn: document.getElementById('auth-submit-btn'),
  authUsername: document.getElementById('auth-username'),
  authFullname: document.getElementById('auth-fullname'),
  authStudentId: document.getElementById('auth-student-id'),
  authPassword: document.getElementById('auth-password'),
  authSwitchLink: document.getElementById('auth-switch-link'),
  authSwitchText: document.getElementById('auth-switch-text'),
  authTitle: document.getElementById('auth-title'),
  authSubtitle: document.getElementById('auth-subtitle'),

  roleParentBtn: document.getElementById('role-parent-btn'),
  roleTeacherBtn: document.getElementById('role-teacher-btn'),
  roleAdminBtn: document.getElementById('role-admin-btn'),
  registerNameGroup: document.getElementById('register-name-group'),
  registerStudentGroup: document.getElementById('register-student-group'),

  userAvatar: document.getElementById('user-avatar'),
  userDisplayName: document.getElementById('user-display-name'),
  userDisplayRole: document.getElementById('user-display-role'),
  logoutBtn: document.getElementById('logout-btn'),

  navDashboard: document.getElementById('nav-dashboard'),
  navMessages: document.getElementById('nav-messages'),
  navAcademic: document.getElementById('nav-academic'),
  navAnnouncements: document.getElementById('nav-announcements'),
  navDirectory: document.getElementById('nav-directory'),
  navAdmin: document.getElementById('nav-admin'),
  navSettings: document.getElementById('nav-settings'),

  linkDashboard: document.getElementById('link-dashboard'),
  linkMessages: document.getElementById('link-messages'),
  linkAcademic: document.getElementById('link-academic'),
  linkAnnouncements: document.getElementById('link-announcements'),
  linkDirectory: document.getElementById('link-directory'),
  linkAdmin: document.getElementById('link-admin'),
  linkSettings: document.getElementById('link-settings'),

  headerPageTitle: document.getElementById('header-page-title'),
  contentBody: document.getElementById('content-body'),

  viewDashboard: document.getElementById('view-dashboard'),
  viewMessages: document.getElementById('view-messages'),
  viewAcademic: document.getElementById('view-academic'),
  viewAnnouncements: document.getElementById('view-announcements'),
  viewDirectory: document.getElementById('view-directory'),
  viewAdmin: document.getElementById('view-admin'),
  viewSettings: document.getElementById('view-settings'),

  dashboardStat1Value: document.getElementById('dashboard-stat1-value'),
  dashboardStat1Label: document.getElementById('dashboard-stat1-label'),
  dashboardStat2Value: document.getElementById('dashboard-stat2-value'),
  dashboardStat2Label: document.getElementById('dashboard-stat2-label'),
  dashboardStat3Value: document.getElementById('dashboard-stat3-value'),
  dashboardStat3Label: document.getElementById('dashboard-stat3-label'),
  dashboardMainPanel: document.getElementById('dashboard-main-panel'),
  dashboardAnnouncementsList: document.getElementById('dashboard-announcements-list'),

  chatList: document.getElementById('chat-list'),
  chatWindow: document.getElementById('chat-window'),
  chatSearchInput: document.getElementById('chat-search-input'),

  academicContentContainer: document.getElementById('academic-content-container'),

  announcementsGrid: document.getElementById('announcements-grid'),
  createAnnouncementTriggerBtn: document.getElementById('create-announcement-trigger-btn'),

  themeToggleBtn: document.getElementById('theme-toggle-btn'),
  themeBtnText: document.getElementById('theme-btn-text'),
  langToggleBtn: document.getElementById('lang-toggle-btn'),

  bellBtn: document.getElementById('bell-btn'),
  bellBadge: document.getElementById('bell-badge'),
  notificationDropdown: document.getElementById('notification-dropdown'),
  notificationList: document.getElementById('notification-list'),

  // Modals
  modalGrade: document.getElementById('modal-grade'),
  modalGradeCloseBtn: document.getElementById('modal-grade-close-btn'),
  modalGradeCancelBtn: document.getElementById('modal-grade-cancel-btn'),
  gradeForm: document.getElementById('grade-form'),
  gradeStudentId: document.getElementById('grade-student-id'),
  gradeSubject: document.getElementById('grade-subject'),
  gradeScore: document.getElementById('grade-score'),
  studentRemarks: document.getElementById('student-remarks'),

  modalAnnouncement: document.getElementById('modal-announcement'),
  modalAnnouncementCloseBtn: document.getElementById('modal-announcement-close-btn'),
  modalAnnouncementCancelBtn: document.getElementById('modal-announcement-cancel-btn'),
  announcementForm: document.getElementById('announcement-form'),
  annTitleKh: document.getElementById('ann-title-kh'),
  annTitleEn: document.getElementById('ann-title-en'),
  annCategory: document.getElementById('ann-category'),
  annContentKh: document.getElementById('ann-content-kh'),
  annContentEn: document.getElementById('ann-content-en'),

  modalLinkStudent: document.getElementById('modal-link-student'),
  modalLinkCloseBtn: document.getElementById('modal-link-close-btn'),
  modalLinkCancelBtn: document.getElementById('modal-link-cancel-btn'),
  linkStudentForm: document.getElementById('link-student-form'),
  linkStudentId: document.getElementById('link-student-id'),

  // Admin specific elements
  adminUserSearch: document.getElementById('admin-user-search'),
  adminUsersTbody: document.getElementById('admin-users-tbody'),
  adminCreateUserForm: document.getElementById('admin-create-user-form'),
  adminNewUsername: document.getElementById('admin-new-username'),
  adminNewFullname: document.getElementById('admin-new-fullname'),
  adminNewRole: document.getElementById('admin-new-role'),
  adminNewStudentGroup: document.getElementById('admin-new-student-group'),
  adminNewStudentId: document.getElementById('admin-new-student-id'),
  adminNewPassword: document.getElementById('admin-new-password'),
  adminDownloadTemplateBtn: document.getElementById('admin-download-template-btn'),
  adminTriggerImportBtn: document.getElementById('admin-trigger-import-btn'),
  adminImportFile: document.getElementById('admin-import-file'),

  modalPermissions: document.getElementById('modal-permissions'),
  modalPermissionsCloseBtn: document.getElementById('modal-permissions-close-btn'),
  modalPermissionsCancelBtn: document.getElementById('modal-permissions-cancel-btn'),
  permissionsForm: document.getElementById('permissions-form'),
  permissionsUsername: document.getElementById('permissions-username'),
  permissionsNewUsername: document.getElementById('permissions-new-username'),
  permissionsPassword: document.getElementById('permissions-password'),
  permissionsFullname: document.getElementById('permissions-fullname'),
  permissionsEmail: document.getElementById('permissions-email'),
  permissionsClassesGroup: document.getElementById('permissions-classes-group'),
  permissionsClasses: document.getElementById('permissions-classes'),
  permissionsStudentGroup: document.getElementById('permissions-student-group'),
  permissionsStudentId: document.getElementById('permissions-student-id'),

  // Directory Elements
  directoryClassSelector: document.getElementById('directory-class-selector'),
  directorySearchInput: document.getElementById('directory-search-input'),
  directoryListGrid: document.getElementById('directory-list-grid'),
  directoryDeleteAllBtn: document.getElementById('directory-delete-all-btn'),

  // Student Edit Elements
  modalStudentEdit: document.getElementById('modal-student-edit'),
  modalStudentEditCloseBtn: document.getElementById('modal-student-edit-close-btn'),
  modalStudentEditCancelBtn: document.getElementById('modal-student-edit-cancel-btn'),
  studentEditForm: document.getElementById('student-edit-form'),
  studentEditOriginalId: document.getElementById('student-edit-original-id'),
  studentEditId: document.getElementById('student-edit-id'),
  studentEditNameKh: document.getElementById('student-edit-name-kh'),
  studentEditNameEn: document.getElementById('student-edit-name-en'),
  studentEditClass: document.getElementById('student-edit-class'),
  settingGSheetUrl: document.getElementById('setting-gsheet-url'),
  settingGSheetSyncBtn: document.getElementById('setting-gsheet-sync-btn'),
  settingGSheetRestoreBtn: document.getElementById('setting-gsheet-restore-btn'),

  toastContainer: document.getElementById('toast-container')
};

// Database LocalStorage Engine Helpers
const db = {
  getUsers: () => JSON.parse(localStorage.getItem('salaconnect_users') || '[]'),
  setUsers: (users) => localStorage.setItem('salaconnect_users', JSON.stringify(users)),
  getStudents: () => JSON.parse(localStorage.getItem('salaconnect_students') || '[]'),
  setStudents: (students) => localStorage.setItem('salaconnect_students', JSON.stringify(students)),
  getMessages: () => JSON.parse(localStorage.getItem('salaconnect_messages') || '[]'),
  setMessages: (messages) => localStorage.setItem('salaconnect_messages', JSON.stringify(messages)),
  getAnnouncements: () => JSON.parse(localStorage.getItem('salaconnect_announcements') || '[]'),
  setAnnouncements: (anns) => localStorage.setItem('salaconnect_announcements', JSON.stringify(anns)),
  getNotifications: () => JSON.parse(localStorage.getItem('salaconnect_notifications') || '[]'),
  setNotifications: (notifs) => localStorage.setItem('salaconnect_notifications', JSON.stringify(notifs))
};

// Khmer vs English Translation dictionary
const dict = {
  km: {
    welcome: "សួស្តី!",
    login: "ចូលប្រើប្រាស់",
    register: "ចុះឈ្មោះ",
    parent: "មាតាបិតា",
    teacher: "គ្រូបង្រៀន",
    admin: "អ្នកគ្រប់គ្រង",
    adminPanel: "ការគ្រប់គ្រងប្រព័ន្ធ",
    emailPlaceholder: "ឧ. dara@email.com ឬ teacher1",
    pwdPlaceholder: "បញ្ចូលពាក្យសម្ងាត់",
    noAccount: "មិនទាន់មានគណនីមែនទេ?",
    alreadyAccount: "មានគណនីរួចហើយមែនទេ? ចូលគណនី",
    fullname: "ឈ្មោះពេញ",
    studentCode: "កូដសិស្ស (STU001, STU002, ល.)",
    dashboard: "ផ្ទាំងគ្រប់គ្រង",
    messages: "សារផ្ញើផ្ទាល់",
    academic: "លទ្ធផលសិក្សា",
    announcements: "សេចក្តីប្រកាស",
    directory: "សមាជិកថ្នាក់",
    settings: "ការកំណត់",
    logout: "ចាកចេញ",
    classes: "ថ្នាក់គ្រប់គ្រង",
    students: "សិស្ស",
    unreadMsgs: "សារថ្មី",
    gpa: "មធ្យមភាគពិន្ទុ",
    attendanceRate: "វត្តមាន",
    studentLinked: "កូនសិស្សភ្ជាប់រួច",
    noStudentLinked: "មិនទាន់មានការភ្ជាប់ទិន្នន័យសិស្ស",
    noStudentLinkedDesc: "សូមភ្ជាប់គណនីរបស់អ្នកទៅកាន់កូដសិស្សរបស់កូនអ្នក ដើម្បីតាមដានលទ្ធផលសិក្សា និងទំនាក់ទំនងជាមួយលោកគ្រូអ្នកគ្រូ។",
    linkNow: "ភ្ជាប់ទំនាក់ទំនងឥឡូវនេះ",
    latestAnn: "សេចក្តីប្រកាសចុងក្រោយ",
    searchPlaceholder: "ស្វែងរកការសន្ទនា...",
    typeMsgPlaceholder: "សរសេរសារនៅទីនេះ...",
    noActiveChat: "សូមជ្រើសរើសការសន្ទនាមួយ",
    noActiveChatDesc: "ដើម្បីចាប់ផ្តើមជជែក និងផ្លាស់ប្តូរព័ត៌មាន",
    remarks: "មតិយោបល់របស់គ្រូ",
    present: "វត្តមាន",
    absent: "អវត្តមាន",
    late: "យឺត",
    saveGrade: "រក្សាទុកពិន្ទុ",
    postNotice: "បង្ហោះប្រកាស",
    toastGradeSaved: "ពិន្ទុត្រូវបានរក្សាទុកដោយជោគជ័យ!",
    toastAnnAdded: "សេចក្តីប្រកាសថ្មីត្រូវបានបង្ហោះ!",
    toastStudentLinked: "បានភ្ជាប់ទៅកាន់សិស្សដោយជោគជ័យ!",
    toastLoginSuccess: "បានចូលប្រើប្រាស់ជោគជ័យ!",
    toastRegisterSuccess: "បានចុះឈ្មោះជោគជ័យ! សូមចូលគណនីរបស់អ្នក។",
    toastAuthError: "ឈ្មោះគណនី ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវឡើយ!",
    toastLinkError: "កូដសិស្សនេះមិនត្រឹមត្រូវ ឬត្រូវបានភ្ជាប់រួចហើយ!",
    toastUserCreated: "គណនីថ្មីត្រូវបានបង្កើតដោយជោគជ័យ!",
    toastUserDeleted: "គណនីត្រូវបានលុបចោល!",
    toastPermUpdated: "សិទ្ធិគណនីត្រូវបានធ្វើបច្ចុប្បន្នភាព!",
    notificationsTitle: "ការជូនដំណឹងថ្មីៗ",
    noNotifications: "មិនទាន់មានការជូនដំណឹងឡើយ",
    parentBadge: "មាតាបិតារបស់",
    gradeUpdatedNotif: "បានធ្វើបច្ចុប្បន្នភាពពិន្ទុ និងវត្តមានរបស់",
    newAnnNotif: "បានបង្ហោះសេចក្តីប្រកាសថ្មី៖"
  },
  en: {
    welcome: "Welcome!",
    login: "Login",
    register: "Register",
    parent: "Parent",
    teacher: "Teacher",
    admin: "Admin",
    adminPanel: "System Admin",
    emailPlaceholder: "e.g., dara@email.com or teacher1",
    pwdPlaceholder: "Enter password",
    noAccount: "Don't have an account?",
    alreadyAccount: "Already have an account? Login here",
    fullname: "Full Name",
    studentCode: "Student Code (STU001, STU002, etc.)",
    dashboard: "Dashboard",
    messages: "Messages",
    academic: "Academic Record",
    announcements: "Announcements",
    directory: "Class Directory",
    settings: "Settings",
    logout: "Logout",
    classes: "Classes Managed",
    students: "Students",
    unreadMsgs: "Unread Messages",
    gpa: "GPA Average",
    attendanceRate: "Attendance",
    studentLinked: "Linked Child",
    noStudentLinked: "No Student Linked",
    noStudentLinkedDesc: "Please link your parent account with your child's student code to monitor progress and message teachers.",
    linkNow: "Link Profile Now",
    latestAnn: "Latest News & Events",
    searchPlaceholder: "Search conversations...",
    typeMsgPlaceholder: "Type a message here...",
    noActiveChat: "Select a Conversation",
    noActiveChatDesc: "To start messaging and exchanging updates",
    remarks: "Teacher's Remarks",
    present: "Present",
    absent: "Absent",
    late: "Late",
    saveGrade: "Save Score",
    postNotice: "Post Announcement",
    toastGradeSaved: "Grades updated successfully!",
    toastAnnAdded: "New announcement posted!",
    toastStudentLinked: "Student linked successfully!",
    toastLoginSuccess: "Logged in successfully!",
    toastRegisterSuccess: "Registration successful! Please login.",
    toastAuthError: "Invalid username or password!",
    toastLinkError: "Invalid or already-linked Student ID!",
    toastUserCreated: "New user account created successfully!",
    toastUserDeleted: "User account deleted successfully!",
    toastPermUpdated: "Account permissions updated successfully!",
    notificationsTitle: "Recent Notifications",
    noNotifications: "No notifications yet",
    parentBadge: "Parent of",
    gradeUpdatedNotif: "updated scores and attendance of",
    newAnnNotif: "posted a new announcement:"
  }
};

// Translation wrapper
function t(key) {
  return dict[state.currentLanguage][key] || key;
}

// Toast alerts helper
function showToast(title, message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
  `;
  el.toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// -------------------------------------------------------------
// APP INITIALIZATION & REGISTRATION
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // Load saved preference state
  const savedLang = localStorage.getItem('salaconnect_lang');
  if (savedLang) state.currentLanguage = savedLang;

  const savedTheme = localStorage.getItem('salaconnect_theme');
  if (savedTheme) {
    state.currentTheme = savedTheme;
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  // Load saved Google Sheets Web App URL preference
  const savedGSheetUrl = localStorage.getItem('salaconnect_gsheet_url') || DEFAULT_GSHEET_URL;
  if (el.settingGSheetUrl) el.settingGSheetUrl.value = savedGSheetUrl;

  updateLanguageUI();
  updateThemeUI();

  // Load session from sessionStorage (for SPA client simulation)
  const savedUser = sessionStorage.getItem('salaconnect_current_user');
  if (savedUser) {
    state.currentUser = JSON.parse(savedUser);
    loginSuccess();
  } else {
    el.authPage.style.display = 'flex';
    el.appContainer.style.display = 'none';
  }

  // Setup Event Listeners
  setupEventListeners();
});

// Setup static event listeners
function setupEventListeners() {
  el.themeToggleBtn.addEventListener('click', toggleTheme);
  el.langToggleBtn.addEventListener('click', toggleLanguage);

  let activeAuthMode = 'login';
  let activeRole = 'parent';

  el.roleParentBtn.addEventListener('click', () => {
    activeRole = 'parent';
    el.roleParentBtn.classList.add('active');
    el.roleTeacherBtn.classList.remove('active');
    el.roleAdminBtn.classList.remove('active');
    toggleAuthFields();
  });

  el.roleTeacherBtn.addEventListener('click', () => {
    activeRole = 'teacher';
    el.roleTeacherBtn.classList.add('active');
    el.roleParentBtn.classList.remove('active');
    el.roleAdminBtn.classList.remove('active');
    toggleAuthFields();
  });

  el.roleAdminBtn.addEventListener('click', () => {
    activeRole = 'admin';
    el.roleAdminBtn.classList.add('active');
    el.roleParentBtn.classList.remove('active');
    el.roleTeacherBtn.classList.remove('active');
    activeAuthMode = 'login'; // Admin cannot register from login page
    toggleAuthFields();
  });

  el.authSwitchLink.addEventListener('click', () => {
    if (activeRole === 'admin') return;
    activeAuthMode = activeAuthMode === 'login' ? 'register' : 'login';
    toggleAuthFields();
  });

  function toggleAuthFields() {
    if (activeRole === 'admin') {
      document.querySelector('.auth-switch').style.display = 'none';
    } else {
      document.querySelector('.auth-switch').style.display = 'block';
    }

    if (activeAuthMode === 'login') {
      let roleTitle = 'មាតាបិតា';
      if (activeRole === 'teacher') roleTitle = 'គ្រូបង្រៀន';
      else if (activeRole === 'admin') roleTitle = 'អ្នកគ្រប់គ្រង';

      el.authTitle.textContent = `ចូលប្រើប្រាស់ - ${roleTitle}`;
      el.authSubtitle.textContent = 'សូមបញ្ចូលគណនីរបស់អ្នកដើម្បីបន្ត';
      el.registerNameGroup.style.display = 'none';
      el.registerStudentGroup.style.display = 'none';
      el.authSubmitBtn.textContent = t('login');
      el.authSwitchText.textContent = t('noAccount');
      el.authSwitchLink.textContent = activeRole === 'parent' ? 'ចុះឈ្មោះមាតាបិតានៅទីនេះ' : 'ចុះឈ្មោះគ្រូនៅទីនេះ';
    } else {
      el.authTitle.textContent = activeRole === 'parent' ? 'ចុះឈ្មោះមាតាបិតាសិស្ស' : 'ចុះឈ្មោះគ្រូបង្រៀនថ្មី';
      el.authSubtitle.textContent = 'បង្កើតគណនីប្រព័ន្ធសាលាខណេក';
      el.registerNameGroup.style.display = 'flex';
      el.registerStudentGroup.style.display = activeRole === 'parent' ? 'flex' : 'none';
      el.authSubmitBtn.textContent = t('register');
      el.authSwitchText.textContent = t('alreadyAccount');
      el.authSwitchLink.textContent = 'ចូលគណនី / Login here';
    }
  }

  // Handle Authentication submit
  el.authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = el.authUsername.value.trim();
    const password = el.authPassword.value.trim();
    const fullname = el.authFullname.value.trim();
    const studentIdInput = el.authStudentId.value.trim().toUpperCase();

    const users = db.getUsers();

    if (activeAuthMode === 'login') {
      const foundUser = users.find(u => (u.username === username || u.email === username) && u.password === password && u.role === activeRole);
      if (foundUser) {
        state.currentUser = foundUser;
        sessionStorage.setItem('salaconnect_current_user', JSON.stringify(foundUser));
        showToast('Success', t('toastLoginSuccess'), 'success');
        loginSuccess();
      } else {
        showToast('Error', t('toastAuthError'), 'danger');
      }
    } else {
      // Register logic
      const userExists = users.some(u => u.username === username);
      if (userExists) {
        showToast('Error', 'Username is already taken!', 'danger');
        return;
      }

      const newUser = {
        username: username,
        nameEN: activeRole === 'teacher' ? `Cher ${fullname}` : fullname,
        nameKH: activeRole === 'teacher' ? `គ្រូ ${fullname}` : fullname,
        email: `${username}@school.edu.kh`,
        password: password,
        role: activeRole,
        avatar: activeRole === 'teacher' ?
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150" :
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
      };

      if (activeRole === 'parent') {
        newUser.studentId = studentIdInput;
        // Verify student exists and parent has not been linked
        const students = db.getStudents();
        const student = students.find(s => s.id === studentIdInput);
        if (studentIdInput && (!student || student.parentId)) {
          showToast('Error', t('toastLinkError'), 'danger');
          return;
        }

        // Update student record link
        if (student) {
          student.parentId = username;
          db.setStudents(students);
        }
      } else {
        newUser.classes = ["12A"]; // default class assigned
      }

      users.push(newUser);
      db.setUsers(users);

      showToast('Success', t('toastRegisterSuccess'), 'success');
      activeAuthMode = 'login';
      toggleAuthFields();
    }
  });

  // Logout Click
  el.logoutBtn.addEventListener('click', () => {
    state.currentUser = null;
    state.lastKnownMessagesCount = null;
    sessionStorage.removeItem('salaconnect_current_user');
    if (state.syncInterval) clearInterval(state.syncInterval);

    el.appContainer.style.display = 'none';
    el.authPage.style.display = 'flex';
    el.authUsername.value = '';
    el.authPassword.value = '';
    el.authFullname.value = '';
    el.authStudentId.value = '';
  });

  // View Navigation
  const navLinks = [
    { link: el.linkDashboard, item: el.navDashboard, view: 'dashboard' },
    { link: el.linkMessages, item: el.navMessages, view: 'messages' },
    { link: el.linkAcademic, item: el.navAcademic, view: 'academic' },
    { link: el.linkAnnouncements, item: el.navAnnouncements, view: 'announcements' },
    { link: el.linkDirectory, item: el.navDirectory, view: 'directory' },
    { link: el.linkAdmin, item: el.navAdmin, view: 'admin' },
    { link: el.linkSettings, item: el.navSettings, view: 'settings' }
  ];

  navLinks.forEach(({ link, item, view }) => {
    if (link && item) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        switchView(view);

        // Update UI active tab
        navLinks.forEach(l => {
          if (l.item) l.item.classList.remove('active');
        });
        item.classList.add('active');
      });
    }
  });

  // Notification Bell trigger
  el.bellBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isShowing = el.notificationDropdown.classList.contains('show');
    if (!isShowing) {
      el.notificationDropdown.classList.add('show');
      // Mark as read
      const allNotifs = db.getNotifications();
      allNotifs.forEach(n => {
        if (n.recipient === state.currentUser.username) n.unread = false;
      });
      db.setNotifications(allNotifs);
      loadNotifications();
    } else {
      el.notificationDropdown.classList.remove('show');
    }
  });

  document.addEventListener('click', () => {
    el.notificationDropdown.classList.remove('show');
  });

  // Modals Listeners
  el.modalGradeCloseBtn.addEventListener('click', () => el.modalGrade.classList.remove('show'));
  el.modalGradeCancelBtn.addEventListener('click', () => el.modalGrade.classList.remove('show'));
  el.gradeForm.addEventListener('submit', handleGradeSubmit);

  el.modalAnnouncementCloseBtn.addEventListener('click', () => el.modalAnnouncement.classList.remove('show'));
  el.modalAnnouncementCancelBtn.addEventListener('click', () => el.modalAnnouncement.classList.remove('show'));
  el.announcementForm.addEventListener('submit', handleAnnouncementSubmit);
  el.createAnnouncementTriggerBtn.addEventListener('click', () => el.modalAnnouncement.classList.add('show'));

  el.modalLinkCloseBtn.addEventListener('click', () => el.modalLinkStudent.classList.remove('show'));
  el.modalLinkCancelBtn.addEventListener('click', () => el.modalLinkStudent.classList.remove('show'));
  el.linkStudentForm.addEventListener('submit', handleStudentLinkSubmit);

  // Admin Specific Listeners
  el.adminNewRole.addEventListener('change', () => {
    if (el.adminNewRole.value === 'parent') {
      el.adminNewStudentGroup.style.display = 'block';
    } else {
      el.adminNewStudentGroup.style.display = 'none';
    }
  });
  el.adminCreateUserForm.addEventListener('submit', handleAdminCreateUser);
  el.adminUserSearch.addEventListener('input', filterAdminUsersList);
  el.adminDownloadTemplateBtn.addEventListener('click', handleDownloadExcelTemplate);
  el.adminTriggerImportBtn.addEventListener('click', () => el.adminImportFile.click());
  el.adminImportFile.addEventListener('change', handleExcelImport);

  el.modalPermissionsCloseBtn.addEventListener('click', () => el.modalPermissions.classList.remove('show'));
  el.modalPermissionsCancelBtn.addEventListener('click', () => el.modalPermissions.classList.remove('show'));
  el.permissionsForm.addEventListener('submit', handlePermissionSave);

  // Directory Listeners
  el.directorySearchInput.addEventListener('input', renderDirectory);
  el.directoryClassSelector.addEventListener('change', renderDirectory);
  el.directoryDeleteAllBtn.addEventListener('click', handleDirectoryDeleteAll);

  // Student Edit Modal Listeners
  el.modalStudentEditCloseBtn.addEventListener('click', () => el.modalStudentEdit.classList.remove('show'));
  el.modalStudentEditCancelBtn.addEventListener('click', () => el.modalStudentEdit.classList.remove('show'));
  el.studentEditForm.addEventListener('submit', handleStudentEditSave);

  // Google Sheets Backup Listeners
  el.settingGSheetSyncBtn.addEventListener('click', syncDatabaseToGoogleSheets);
  el.settingGSheetRestoreBtn.addEventListener('click', restoreDatabaseFromGoogleSheets);
}

function loginSuccess() {
  el.authPage.style.display = 'none';
  el.appContainer.style.display = 'flex';

  // Set profile details
  el.userAvatar.src = state.currentUser.avatar;
  el.userDisplayName.textContent = state.currentLanguage === 'km' ? state.currentUser.nameKH : state.currentUser.nameEN;

  // Show / Hide menus and views by Role
  if (state.currentUser.role === 'admin') {
    el.userDisplayRole.textContent = t('admin');
    el.navAdmin.style.display = 'block';
    el.navMessages.style.display = 'none';
    el.navAcademic.style.display = 'none';
    el.navDirectory.style.display = 'none';
    el.navDashboard.style.display = 'block';
    el.createAnnouncementTriggerBtn.style.display = 'block'; // Admin can also post announcements
    switchView('admin');

    // Set active link in sidebar
    el.navDashboard.classList.remove('active');
    el.navAdmin.classList.add('active');
  } else if (state.currentUser.role === 'teacher') {
    el.userDisplayRole.textContent = t('teacher');
    el.navAdmin.style.display = 'none';
    el.navMessages.style.display = 'block';
    el.navAcademic.style.display = 'block';
    el.navDirectory.style.display = 'block';
    el.navDashboard.style.display = 'block';
    el.createAnnouncementTriggerBtn.style.display = 'block';
    switchView('dashboard');

    el.navDashboard.classList.add('active');
    el.navAdmin.classList.remove('active');
  } else {
    el.userDisplayRole.textContent = t('parent');
    el.navAdmin.style.display = 'none';
    el.navMessages.style.display = 'block';
    el.navAcademic.style.display = 'block';
    el.navDirectory.style.display = 'block';
    el.navDashboard.style.display = 'block';
    el.createAnnouncementTriggerBtn.style.display = 'none';
    switchView('dashboard');

    el.navDashboard.classList.add('active');
    el.navAdmin.classList.remove('active');
  }

  // Load custom notifications for the current user
  loadNotifications();

  // Sync state between tabs/roles (simulating live updates locally)
  if (state.currentUser) {
    const msgs = db.getMessages();
    const initialReceived = msgs.filter(m => {
      const isRecipient = m.receiver === state.currentUser.username;
      const isClassGroup = state.currentUser.role === 'teacher'
        ? (state.currentUser.classes || []).includes(m.receiver)
        : (state.currentUser.role === 'parent' && state.currentUser.studentId
          ? (db.getStudents().find(s => s.id === state.currentUser.studentId)?.class === m.receiver)
          : false);
      return (isRecipient || isClassGroup) && m.sender !== state.currentUser.username;
    });
    state.lastKnownMessagesCount = initialReceived.length;
  }

  if (state.syncInterval) clearInterval(state.syncInterval);
  state.syncInterval = setInterval(() => {
    if (state.currentUser) {
      loadNotifications();

      // Check for incoming messages count
      const msgs = db.getMessages();
      const received = msgs.filter(m => {
        const isRecipient = m.receiver === state.currentUser.username;
        const isClassGroup = state.currentUser.role === 'teacher'
          ? (state.currentUser.classes || []).includes(m.receiver)
          : (state.currentUser.role === 'parent' && state.currentUser.studentId
            ? (db.getStudents().find(s => s.id === state.currentUser.studentId)?.class === m.receiver)
            : false);
        return (isRecipient || isClassGroup) && m.sender !== state.currentUser.username;
      });

      if (state.lastKnownMessagesCount !== null && received.length > state.lastKnownMessagesCount) {
        playNotificationSound();
        if (state.activeView === 'messages') {
          renderChatsQuietly();
          if (state.activeChatRecipient) {
            renderMessagesQuietly();
          }
        }
      }
      state.lastKnownMessagesCount = received.length;

      if (state.activeView === 'messages') {
        renderChatsQuietly();
      }
    }
  }, 4000);
}

function switchView(viewName) {
  state.activeView = viewName;

  const views = [
    { dom: el.viewDashboard, name: 'dashboard' },
    { dom: el.viewMessages, name: 'messages' },
    { dom: el.viewAcademic, name: 'academic' },
    { dom: el.viewAnnouncements, name: 'announcements' },
    { dom: el.viewDirectory, name: 'directory' },
    { dom: el.viewAdmin, name: 'admin' },
    { dom: el.viewSettings, name: 'settings' }
  ];

  views.forEach(v => {
    if (v.dom) {
      if (v.name === viewName) {
        v.dom.classList.add('active');
      } else {
        v.dom.classList.remove('active');
      }
    }
  });

  if (viewName === 'admin') {
    el.headerPageTitle.textContent = t('adminPanel');
  } else {
    el.headerPageTitle.textContent = t(viewName);
  }

  if (viewName === 'dashboard') renderDashboard();
  else if (viewName === 'messages') renderMessages();
  else if (viewName === 'academic') renderAcademic();
  else if (viewName === 'announcements') renderAnnouncements();
  else if (viewName === 'admin') renderAdmin();
  else if (viewName === 'directory') renderDirectory();
}

// -------------------------------------------------------------
// BILINGUAL ENGINE
// -------------------------------------------------------------
function toggleLanguage() {
  state.currentLanguage = state.currentLanguage === 'km' ? 'en' : 'km';
  localStorage.setItem('salaconnect_lang', state.currentLanguage);
  updateLanguageUI();

  if (state.currentUser) {
    el.userDisplayName.textContent = state.currentLanguage === 'km' ? state.currentUser.nameKH : state.currentUser.nameEN;
    if (state.currentUser.role === 'admin') {
      el.userDisplayRole.textContent = t('admin');
    } else {
      el.userDisplayRole.textContent = state.currentUser.role === 'teacher' ? t('teacher') : t('parent');
    }
    switchView(state.activeView);
  }
}

function updateLanguageUI() {
  document.querySelectorAll('.lang-txt').forEach(element => {
    const kh = element.getAttribute('data-kh');
    const en = element.getAttribute('data-en');
    element.textContent = state.currentLanguage === 'km' ? kh : en;
  });

  if (state.currentLanguage === 'km') {
    el.langToggleBtn.textContent = '🌐 EN';
    document.getElementById('label-username').textContent = 'ឈ្មោះគណនី ឬ អ៊ីមែល';
    document.getElementById('label-password').textContent = 'ពាក្យសម្ងាត់';
    document.getElementById('label-fullname').textContent = 'ឈ្មោះពេញ';
    document.getElementById('label-studentcode').textContent = 'កូដសិស្ស (សម្រាប់ភ្ជាប់ទំនាក់ទំនង)';
    document.getElementById('label-gradesubject').textContent = 'មុខវិជ្ជា';
    document.getElementById('label-gradescore').textContent = 'ពិន្ទុ (០-១០០)';
    document.getElementById('label-graderemarks').textContent = 'មតិយោបល់របស់គ្រូ';

    document.getElementById('label-anntitlekh').textContent = 'ចំណងជើង (ភាសាខ្មែរ)';
    document.getElementById('label-anntitleen').textContent = 'ចំណងជើង (English)';
    document.getElementById('label-anncategory').textContent = 'ប្រភេទសេចក្តីប្រកាស';
    document.getElementById('label-anndesckh').textContent = 'ខ្លឹមសារប្រកាស (ភាសាខ្មែរ)';
    document.getElementById('label-anndescen').textContent = 'ខ្លឹមសារប្រកាស (English)';
    document.getElementById('label-linkcode').textContent = 'កូដសិស្ស (ឧទាហរណ៍៖ STU003)';
  } else {
    el.langToggleBtn.textContent = '🌐 ខ្មែរ';
    document.getElementById('label-username').textContent = 'Username or Email';
    document.getElementById('label-password').textContent = 'Password';
    document.getElementById('label-fullname').textContent = 'Full Name';
    document.getElementById('label-studentcode').textContent = 'Student Code (to link)';
    document.getElementById('label-gradesubject').textContent = 'Subject';
    document.getElementById('label-gradescore').textContent = 'Score (0-100)';
    document.getElementById('label-graderemarks').textContent = "Teacher's Remarks";

    document.getElementById('label-anntitlekh').textContent = 'Title (Khmer)';
    document.getElementById('label-anntitleen').textContent = 'Title (English)';
    document.getElementById('label-anncategory').textContent = 'Category';
    document.getElementById('label-anndesckh').textContent = 'Content (Khmer)';
    document.getElementById('label-anndescen').textContent = 'Content (English)';
    document.getElementById('label-linkcode').textContent = 'Student Code (e.g. STU003)';
  }
}

// -------------------------------------------------------------
// THEME SWITCHER
// -------------------------------------------------------------
function toggleTheme() {
  state.currentTheme = state.currentTheme === 'light' ? 'dark' : 'light';
  localStorage.setItem('salaconnect_theme', state.currentTheme);
  document.documentElement.setAttribute('data-theme', state.currentTheme);
  updateThemeUI();
}

function updateThemeUI() {
  if (state.currentTheme === 'light') {
    el.themeToggleBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" style="width:16px;height:16px" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
      <span>Dark Mode</span>
    `;
  } else {
    el.themeToggleBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" style="width:16px;height:16px" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.364l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <span>Light Mode</span>
    `;
  }
}

// -------------------------------------------------------------
// NOTIFICATIONS MODULE
// -------------------------------------------------------------
function loadNotifications() {
  const notifs = db.getNotifications();
  state.notifications = notifs.filter(n => n.recipient === state.currentUser.username);
  renderNotificationDropdown();
}

function addNotification(recipient, textEN, textKH) {
  const notifs = db.getNotifications();
  const newNotif = {
    id: `notif_${Date.now()}`,
    recipient,
    textEN,
    textKH,
    created_at: new Date().toISOString(),
    unread: true
  };
  notifs.unshift(newNotif);
  db.setNotifications(notifs);

  if (state.currentUser && state.currentUser.username === recipient) {
    state.notifications.unshift(newNotif);
    renderNotificationDropdown();
  }
}

function renderNotificationDropdown() {
  const unreadCount = state.notifications.filter(n => n.unread).length;

  if (unreadCount > 0) {
    el.bellBadge.classList.add('active');
  } else {
    el.bellBadge.classList.remove('active');
  }

  if (state.notifications.length === 0) {
    el.notificationList.innerHTML = `<div class="notification-empty">${t('noNotifications')}</div>`;
    return;
  }

  el.notificationList.innerHTML = state.notifications.map(n => `
    <div class="notification-item ${n.unread ? 'unread' : ''}" data-id="${n.id}">
      <div class="notification-item-text">
        ${state.currentLanguage === 'km' ? n.textKH : n.textEN}
      </div>
      <div class="notification-item-time">${formatTimeAgo(n.created_at)}</div>
    </div>
  `).join('');
}

// -------------------------------------------------------------
// DASHBOARD CONTROLLER
// -------------------------------------------------------------
function renderDashboard() {
  const students = db.getStudents();
  const announcements = db.getAnnouncements();

  if (state.currentUser.role === 'teacher') {
    el.dashboardStat1Value.textContent = state.currentUser.classes.length;
    el.dashboardStat1Label.textContent = state.currentLanguage === 'km' ? 'ថ្នាក់គ្រប់គ្រង' : 'Classes Managed';

    const studentCount = students.filter(s => state.currentUser.classes.includes(s.class)).length;
    el.dashboardStat2Value.textContent = studentCount;
    el.dashboardStat2Label.textContent = state.currentLanguage === 'km' ? 'ចំនួនសិស្សសរុប' : 'Total Students';

    const msgs = db.getMessages();
    const incomingCount = msgs.filter(m => m.receiver === state.currentUser.username).length;
    el.dashboardStat3Value.textContent = incomingCount;
    el.dashboardStat3Label.textContent = state.currentLanguage === 'km' ? 'សារទទួលបាន' : 'Messages Received';

    renderTeacherClassGrid();
  } else {
    // Parent View
    const child = students.find(s => s.id === state.currentUser.studentId);

    if (child) {
      el.dashboardStat1Value.textContent = state.currentLanguage === 'km' ? child.nameKH : child.nameEN;
      el.dashboardStat1Label.textContent = state.currentLanguage === 'km' ? 'ឈ្មោះសិស្ស' : 'Student Linked';

      const grades = Object.values(child.grades);
      const avg = Math.round(grades.reduce((a, b) => a + b, 0) / grades.length);
      el.dashboardStat2Value.textContent = `${avg}%`;
      el.dashboardStat2Label.textContent = state.currentLanguage === 'km' ? 'ពិន្ទុមធ្យមភាគ' : 'GPA Average';

      const totalDays = child.attendance.Present + child.attendance.Absent + child.attendance.Late;
      const rate = totalDays > 0 ? Math.round((child.attendance.Present / totalDays) * 100) : 100;
      el.dashboardStat3Value.textContent = `${rate}%`;
      el.dashboardStat3Label.textContent = state.currentLanguage === 'km' ? 'កម្រិតវត្តមាន' : 'Attendance Rate';

      renderParentStudentSummary(child);
    } else {
      el.dashboardStat1Value.textContent = '-';
      el.dashboardStat1Label.textContent = t('studentLinked');
      el.dashboardStat2Value.textContent = '0%';
      el.dashboardStat2Label.textContent = t('gpa');
      el.dashboardStat3Value.textContent = '0%';
      el.dashboardStat3Label.textContent = t('attendanceRate');

      el.dashboardMainPanel.innerHTML = `
        <div class="student-link-widget">
          <h3>⚠️ ${t('noStudentLinked')}</h3>
          <p>${t('noStudentLinkedDesc')}</p>
          <button id="dashboard-link-trigger-btn" class="btn-primary">${t('linkNow')}</button>
        </div>
      `;
      document.getElementById('dashboard-link-trigger-btn').addEventListener('click', () => {
        el.modalLinkStudent.classList.add('show');
      });
    }
  }

  // Render announcements quick view
  const latestAnns = announcements.slice(0, 2);
  if (latestAnns.length === 0) {
    el.dashboardAnnouncementsList.innerHTML = `<p style="font-size:12px;color:var(--text-secondary)">No announcements yet</p>`;
  } else {
    el.dashboardAnnouncementsList.innerHTML = latestAnns.map(ann => `
      <div style="border-bottom: 1px solid var(--border-color); padding-bottom:12px;">
        <span style="font-size:10px; font-weight:700; color:var(--primary); text-transform:uppercase;">
          ${state.currentLanguage === 'km' ? ann.categoryKH : ann.categoryEN}
        </span>
        <h4 style="font-size:14px; font-weight:600; margin: 4px 0;">
          ${state.currentLanguage === 'km' ? ann.titleKH : ann.titleEN}
        </h4>
        <p style="font-size:12px; color:var(--text-secondary); display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">
          ${state.currentLanguage === 'km' ? ann.contentKH : ann.contentEN}
        </p>
      </div>
    `).join('');
  }
}

function renderTeacherClassGrid() {
  const students = db.getStudents();
  let html = `
    <div class="card-container">
      <h3 class="card-title lang-txt" data-kh="ទិដ្ឋភាពទូទៅតាមថ្នាក់រៀន" data-en="Class Overview" style="margin-bottom:20px;">ទិដ្ឋភាពទូទៅតាមថ្នាក់រៀន</h3>
      <div style="display:flex; flex-direction:column; gap:16px;">
  `;

  state.currentUser.classes.forEach(cls => {
    const classStudents = students.filter(s => s.class === cls);
    let avgSum = 0;
    classStudents.forEach(s => {
      const grades = Object.values(s.grades);
      avgSum += grades.reduce((a, b) => a + b, 0) / grades.length;
    });
    const classAvg = classStudents.length > 0 ? Math.round(avgSum / classStudents.length) : 0;

    html += `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:16px; background:var(--border-color); border-radius:var(--radius-md); border:1px solid var(--card-border);">
        <div>
          <span class="badge-class">${cls}</span>
          <span style="font-size:14px; font-weight:600; margin-left:12px;">
            ${classStudents.length} ${state.currentLanguage === 'km' ? 'សិស្ស' : 'Students'}
          </span>
        </div>
        <div style="text-align:right;">
          <div style="font-size:14px; font-weight:700; color:var(--primary);">${classAvg}%</div>
          <div style="font-size:10px; color:var(--text-secondary);">${state.currentLanguage === 'km' ? 'មធ្យមភាគថ្នាក់' : 'Class Avg'}</div>
        </div>
      </div>
    `;
  });

  html += `
      </div>
    </div>
  `;
  el.dashboardMainPanel.innerHTML = html;
}

function renderParentStudentSummary(child) {
  const users = db.getUsers();
  const classTeachers = users.filter(u => u.role === 'teacher' && u.classes.includes(child.class));

  let html = `
    <div class="card-container">
      <h3 class="card-title" style="margin-bottom:16px;">
        ${state.currentLanguage === 'km' ? 'របាយការណ៍សង្ខេបរបស់ ' + child.nameKH : child.nameEN + "'s Academic Summary"}
      </h3>
      <p style="font-size:13px; color:var(--text-secondary); line-height:1.6; margin-bottom:20px; font-style:italic;">
        "${child.remarks}"
      </p>
      
      <h4 style="font-size:14px; font-weight:600; margin-bottom:12px;">${state.currentLanguage === 'km' ? 'ទំនាក់ទំនងគ្រូបង្រៀន' : 'Connect with Teachers'}</h4>
      <div style="display:flex; flex-direction:column; gap:12px;">
  `;

  classTeachers.forEach(teacher => {
    html += `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:12px; background:var(--border-color); border-radius:var(--radius-md); border:1px solid var(--card-border);">
        <div style="display:flex; align-items:center; gap:12px;">
          <img src="${teacher.avatar}" style="width:36px; height:36px; border-radius:50%; object-fit:cover;">
          <div>
            <div style="font-size:13px; font-weight:600;">${state.currentLanguage === 'km' ? teacher.nameKH : teacher.nameEN}</div>
            <div style="font-size:10px; color:var(--text-secondary);">${teacher.email}</div>
          </div>
        </div>
        <button class="btn-primary chat-teacher-shortcut" data-username="${teacher.username}" style="padding: 6px 12px; font-size:11px;">
          ${state.currentLanguage === 'km' ? 'ផ្ញើសារ' : 'Message'}
        </button>
      </div>
    `;
  });

  html += `
      </div>
    </div>
  `;

  el.dashboardMainPanel.innerHTML = html;

  el.dashboardMainPanel.querySelectorAll('.chat-teacher-shortcut').forEach(btn => {
    btn.addEventListener('click', () => {
      const teacherUsername = btn.getAttribute('data-username');
      state.activeChatRecipient = teacherUsername;
      switchView('messages');
      el.navDashboard.classList.remove('active');
      el.navMessages.classList.add('active');
    });
  });
}

// -------------------------------------------------------------
// CHAT PORTAL
// -------------------------------------------------------------
function renderMessages() {
  renderChatsQuietly();

  if (state.activeChatRecipient) {
    renderMessagesQuietly();
  } else {
    el.chatWindow.innerHTML = `
      <div class="chat-empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        <h3 class="lang-txt" data-kh="សូមជ្រើសរើសការសន្ទនាមួយ" data-en="Select a conversation">សូមជ្រើសរើសការសន្ទនាមួយ</h3>
        <p class="lang-txt" data-kh="ដើម្បីចាប់ផ្តើមជជែក និងផ្លាស់ប្តូរព័ត៌មាន" data-en="To start messaging and exchanging updates">ដើម្បីចាប់ផ្តើមជជែក និងផ្លាស់ប្តូរព័ត៌មាន</p>
      </div>
    `;
    updateLanguageUI();
  }

  el.chatSearchInput.removeEventListener('input', filterChatsList);
  el.chatSearchInput.addEventListener('input', filterChatsList);
}

function getMsgPreview(msg, defaultVal) {
  if (!msg) return defaultVal;
  const type = msg.type || 'text';
  if (type === 'image') return state.currentLanguage === 'km' ? '[រូបភាព]' : '[Image]';
  if (type === 'audio') return state.currentLanguage === 'km' ? '[សារសម្លេង]' : '[Voice Note]';
  if (type === 'sticker') return state.currentLanguage === 'km' ? '[ស្ទីកឃ័រ]' : '[Sticker]';
  return msg.text;
}

function renderChatsQuietly() {
  const users = db.getUsers();
  const students = db.getStudents();
  const msgs = db.getMessages();

  let chats = [];

  if (state.currentUser.role === 'teacher') {
    state.currentUser.classes.forEach(cls => {
      const lastGroupMsg = msgs.filter(m => m.receiver === cls).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
      chats.push({
        id: cls,
        nameEN: `Class ${cls} Group`,
        nameKH: `ក្រុមទំនាក់ទំនងថ្នាក់ទី ${cls}`,
        isGroup: true,
        previewText: getMsgPreview(lastGroupMsg, state.currentLanguage === 'km' ? 'គ្មានសារឡើយ' : 'No messages yet'),
        previewTime: lastGroupMsg ? lastGroupMsg.timestamp : null
      });
    });

    const managedStudentIds = students.filter(s => state.currentUser.classes.includes(s.class) && s.parentId).map(s => s.parentId);
    const parents = users.filter(u => u.role === 'parent' && managedStudentIds.includes(u.username));

    parents.forEach(p => {
      const threadMsgs = msgs.filter(m =>
        (m.sender === state.currentUser.username && m.receiver === p.username) ||
        (m.sender === p.username && m.receiver === state.currentUser.username)
      ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      const linkedStu = students.find(s => s.id === p.studentId);

      chats.push({
        id: p.username,
        nameEN: p.nameEN,
        nameKH: p.nameKH,
        avatar: p.avatar,
        isGroup: false,
        previewText: getMsgPreview(threadMsgs[0], state.currentLanguage === 'km' ? 'មិនទាន់មានការសន្ទនា' : 'No conversations yet'),
        previewTime: threadMsgs.length > 0 ? threadMsgs[0].timestamp : null,
        linkedStudentName: linkedStu ? (state.currentLanguage === 'km' ? linkedStu.nameKH : linkedStu.nameEN) : ''
      });
    });
  } else {
    // Parent
    const linkedStudent = students.find(s => s.id === state.currentUser.studentId);
    if (linkedStudent) {
      const cls = linkedStudent.class;
      const lastGroupMsg = msgs.filter(m => m.receiver === cls).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
      chats.push({
        id: cls,
        nameEN: `Class ${cls} Group`,
        nameKH: `ក្រុមទំនាក់ទំនងថ្នាក់ទី ${cls}`,
        isGroup: true,
        previewText: getMsgPreview(lastGroupMsg, state.currentLanguage === 'km' ? 'គ្មានសារឡើយ' : 'No messages yet'),
        previewTime: lastGroupMsg ? lastGroupMsg.timestamp : null
      });

      const classTeachers = users.filter(u => u.role === 'teacher' && u.classes.includes(cls));
      classTeachers.forEach(t => {
        const threadMsgs = msgs.filter(m =>
          (m.sender === state.currentUser.username && m.receiver === t.username) ||
          (m.sender === t.username && m.receiver === state.currentUser.username)
        ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        chats.push({
          id: t.username,
          nameEN: t.nameEN,
          nameKH: t.nameKH,
          avatar: t.avatar,
          isGroup: false,
          previewText: getMsgPreview(threadMsgs[0], state.currentLanguage === 'km' ? 'មិនទាន់មានការសន្ទនា' : 'No conversations yet'),
          previewTime: threadMsgs.length > 0 ? threadMsgs[0].timestamp : null
        });
      });
    }
  }

  chats.sort((a, b) => {
    if (!a.previewTime) return 1;
    if (!b.previewTime) return -1;
    return new Date(b.previewTime) - new Date(a.previewTime);
  });

  if (chats.length === 0) {
    el.chatList.innerHTML = `<div style="padding:20px;text-align:center;color:var(--text-secondary);font-size:12px;">No chats available</div>`;
    return;
  }

  el.chatList.innerHTML = chats.map(chat => {
    const isActive = state.activeChatRecipient === chat.id;
    return `
      <div class="chat-list-item ${isActive ? 'active' : ''}" data-id="${chat.id}">
        ${chat.isGroup ? `
          <div class="chat-item-avatar group-avatar">${chat.id}</div>
        ` : `
          <img class="chat-item-avatar" src="${chat.avatar}">
        `}
        <div class="chat-item-info">
          <div class="chat-item-header">
            <span class="chat-item-name">${state.currentLanguage === 'km' ? chat.nameKH : chat.nameEN}</span>
            <span class="chat-item-time">${chat.previewTime ? formatTime(chat.previewTime) : ''}</span>
          </div>
          <div class="chat-item-preview">
            ${chat.linkedStudentName ? `<span class="student-context-badge" style="margin-right:6px;">${t('parentBadge')} ${chat.linkedStudentName}</span>` : ''}
            ${chat.previewText}
          </div>
        </div>
      </div>
    `;
  }).join('');

  el.chatList.querySelectorAll('.chat-list-item').forEach(item => {
    item.addEventListener('click', () => {
      state.activeChatRecipient = item.getAttribute('data-id');
      renderMessages();
    });
  });
}

function renderMessagesQuietly() {
  const users = db.getUsers();
  const msgs = db.getMessages();

  // Find info from active lists
  const isGroup = /^\d+[A-Z]$/.test(state.activeChatRecipient);
  const messagesShell = document.getElementById('chat-messages-container');

  if (!messagesShell) {
    // Build Chat Window layout
    let recipientName = state.activeChatRecipient;
    let recipientAvatar = '';
    let studentBadgeHtml = '';

    if (isGroup) {
      recipientName = state.currentLanguage === 'km' ? `ក្រុមទំនាក់ទំនងថ្នាក់ទី ${state.activeChatRecipient}` : `Class ${state.activeChatRecipient} Group`;
      studentBadgeHtml = `<span class="student-context-badge">${state.currentLanguage === 'km' ? 'ប្រអប់សារក្រុមថ្នាក់' : 'Group Channel'}</span>`;
    } else {
      const activeListItem = el.chatList.querySelector(`.chat-list-item[data-id="${state.activeChatRecipient}"]`);
      if (activeListItem) {
        recipientName = activeListItem.querySelector('.chat-item-name').textContent;
        const img = activeListItem.querySelector('.chat-item-avatar');
        recipientAvatar = img ? img.src : '';
        const badge = activeListItem.querySelector('.student-context-badge');
        if (badge) studentBadgeHtml = badge.outerHTML;
      }
    }

    el.chatWindow.innerHTML = `
      <div class="chat-header">
        <div class="chat-header-user">
          ${isGroup ? `
            <div class="chat-item-avatar group-avatar" style="width:40px;height:40px">${state.activeChatRecipient}</div>
          ` : `
            <img class="chat-item-avatar" style="width:40px;height:40px" src="${recipientAvatar}">
          `}
          <div>
            <div style="font-weight:700;font-size:15px;">${recipientName}</div>
            ${studentBadgeHtml}
          </div>
        </div>
      </div>
      
      <div id="chat-messages-container" class="chat-messages"></div>

      <div class="chat-footer" style="display: flex; flex-direction: column; gap: 8px;">
        <!-- Sticker Picker Panel -->
        <div id="chat-sticker-picker" style="display: none; padding: 10px; background: var(--card-bg); border: 1px solid var(--border-color); border-radius: var(--radius-md); grid-template-columns: repeat(6, 1fr); gap: 10px; max-height: 180px; overflow-y: auto; z-index: 10;">
          <!-- Sticker items loaded dynamically -->
        </div>

        <div style="display: flex; align-items: center; gap: 8px; width: 100%;">
          <!-- Image upload button -->
          <button id="chat-image-btn" class="btn-secondary" style="padding: 8px; border-radius: 50%; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;" title="Send Image">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 20px; height: 20px;">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </button>
          <input type="file" id="chat-image-input" accept="image/*" style="display: none;">

          <!-- Voice recorder button -->
          <button id="chat-voice-btn" class="btn-secondary" style="padding: 8px; border-radius: 50%; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; position: relative;" title="Record Voice">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 20px; height: 20px;">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
            <span id="voice-recording-dot" style="display: none; position: absolute; top: 4px; right: 4px; width: 8px; height: 8px; border-radius: 50%; background: var(--danger); animation: pulse 1s infinite;"></span>
          </button>

          <!-- Sticker button -->
          <button id="chat-sticker-btn" class="btn-secondary" style="padding: 8px; border-radius: 50%; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;" title="Stickers">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 20px; height: 20px;">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
            </svg>
          </button>

          <!-- Text Input -->
          <div class="chat-input-wrapper" style="flex: 1; min-width: 0;">
            <input type="text" id="chat-send-input" class="chat-input" placeholder="${t('typeMsgPlaceholder')}">
          </div>

          <!-- Send Button -->
          <button id="chat-send-btn" class="btn-send" style="flex-shrink: 0;">
            <svg xmlns="http://www.w3.org/2000/svg" style="width:20px;height:20px;transform:rotate(-45deg);margin-left:4px" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 19l9-2 9-18-18 9-2 9 3 3 5-5m-5 5v5l5-5h5" />
            </svg>
          </button>
        </div>
      </div>
    `;

    const chatInput = document.getElementById('chat-send-input');
    const chatSendBtn = document.getElementById('chat-send-btn');
    const chatImageBtn = document.getElementById('chat-image-btn');
    const chatImageInput = document.getElementById('chat-image-input');
    const chatVoiceBtn = document.getElementById('chat-voice-btn');
    const chatStickerBtn = document.getElementById('chat-sticker-btn');

    chatSendBtn.addEventListener('click', () => sendLocalChatMessage(isGroup));
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendLocalChatMessage(isGroup);
    });

    chatImageBtn.addEventListener('click', () => chatImageInput.click());
    chatImageInput.addEventListener('change', (e) => handleChatImageSelected(e, isGroup));
    chatVoiceBtn.addEventListener('click', () => toggleVoiceRecording(isGroup));
    chatStickerBtn.addEventListener('click', () => toggleStickerPicker());
  }

  // Populate actual message elements
  const threadMsgs = msgs.filter(m => {
    if (isGroup) return m.receiver === state.activeChatRecipient;
    return (m.sender === state.currentUser.username && m.receiver === state.activeChatRecipient) ||
      (m.sender === state.activeChatRecipient && m.receiver === state.currentUser.username);
  }).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const container = document.getElementById('chat-messages-container');
  const oldScroll = container.scrollHeight - container.scrollTop;

  container.innerHTML = threadMsgs.map(m => {
    const isSender = m.sender === state.currentUser.username;
    let senderName = '';
    if (!isSender && isGroup) {
      const senderObj = users.find(u => u.username === m.sender);
      senderName = senderObj ? (state.currentLanguage === 'km' ? senderObj.nameKH : senderObj.nameEN) : m.sender;
    }

    const type = m.type || 'text';
    let bubbleContent = '';

    if (type === 'image') {
      bubbleContent = `<img src="${m.text}" style="max-width: 220px; border-radius: var(--radius-md); cursor: pointer; display: block;" onclick="window.open('${m.text}')">`;
    } else if (type === 'audio') {
      bubbleContent = `<audio src="${m.text}" controls style="max-width: 240px; border-radius: var(--radius-md); display: block;"></audio>`;
    } else if (type === 'sticker') {
      return `
        <div class="chat-bubble-container ${isSender ? 'sender' : 'receiver'}">
          ${senderName ? `<span class="chat-bubble-sender-name">${senderName}</span>` : ''}
          <div style="padding: 4px; display: inline-block;">
            <img src="${m.text}" style="width: 100px; height: 100px; object-fit: contain; display: block;">
          </div>
          <div class="chat-bubble-time" style="margin-top: 4px;">${formatTime(m.timestamp)}</div>
        </div>
      `;
    } else {
      bubbleContent = m.text;
    }

    return `
      <div class="chat-bubble-container ${isSender ? 'sender' : 'receiver'}">
        ${senderName ? `<span class="chat-bubble-sender-name">${senderName}</span>` : ''}
        <div class="chat-bubble" style="${type === 'image' || type === 'audio' ? 'padding: 6px; background: transparent; border: none; box-shadow: none;' : ''}">
          ${bubbleContent}
        </div>
        <div class="chat-bubble-time">${formatTime(m.timestamp)}</div>
      </div>
    `;
  }).join('');

  container.scrollTop = container.scrollHeight;
  setTimeout(() => {
    container.scrollTop = container.scrollHeight;
  }, 50);
}

function sendLocalChatMessage(isGroup) {
  const chatInput = document.getElementById('chat-send-input');
  const text = chatInput.value.trim();
  if (!text) return;

  const allMsgs = db.getMessages();
  const newMsg = {
    id: `msg_${Date.now()}`,
    sender: state.currentUser.username,
    receiver: state.activeChatRecipient,
    text: text,
    type: 'text',
    timestamp: new Date().toISOString(),
    isGroup: isGroup
  };

  allMsgs.push(newMsg);
  db.setMessages(allMsgs);

  // Send background alerts if private
  if (!isGroup) {
    addNotification(
      state.activeChatRecipient,
      `${state.currentUser.nameEN} sent you a message: "${text.substring(0, 30)}..."`,
      `${state.currentUser.nameKH} បានផ្ញើសារមកអ្នក៖ "${text.substring(0, 30)}..."`
    );
  }

  chatInput.value = '';
  renderMessages();
}

function filterChatsList() {
  const query = el.chatSearchInput.value.toLowerCase().trim();
  el.chatList.querySelectorAll('.chat-list-item').forEach(item => {
    const name = item.querySelector('.chat-item-name').textContent.toLowerCase();
    if (name.includes(query)) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

// -------------------------------------------------------------
// ACADEMIC PORTAL
// -------------------------------------------------------------
function renderAcademic() {
  const students = db.getStudents();

  if (state.currentUser.role === 'teacher') {
    let html = `
      <div class="card-container">
        <div class="card-header-flex">
          <h3 class="card-title lang-txt" data-kh="ការគ្រប់គ្រងលទ្ធផលសិក្សារបស់សិស្ស" data-en="Student Academic Dashboard">ការគ្រប់គ្រងលទ្ធផលសិក្សារបស់សិស្ស</h3>
          <select id="teacher-class-selector" class="form-input" style="width:180px;">
            ${state.currentUser.classes.map(c => `<option value="${c}">${state.currentLanguage === 'km' ? 'ថ្នាក់ ' + c : 'Class ' + c}</option>`).join('')}
          </select>
        </div>
        <div id="teacher-students-grid" class="student-grid"></div>
      </div>
    `;

    el.academicContentContainer.innerHTML = html;

    const classSelector = document.getElementById('teacher-class-selector');
    const updateStudentsList = () => {
      const selectedClass = classSelector.value;
      const filteredStudents = students.filter(s => s.class === selectedClass);
      const grid = document.getElementById('teacher-students-grid');

      if (filteredStudents.length === 0) {
        grid.innerHTML = `<p style="padding:20px;text-align:center;color:var(--text-secondary)">No students in this class</p>`;
        return;
      }

      grid.innerHTML = filteredStudents.map(student => {
        const grades = Object.values(student.grades);
        const avg = Math.round(grades.reduce((a, b) => a + b, 0) / grades.length);

        return `
          <div class="student-card" data-id="${student.id}">
            <div class="student-card-header">
              <div>
                <div class="student-card-name">${state.currentLanguage === 'km' ? student.nameKH : student.nameEN}</div>
                <div class="student-card-class">ID: ${student.id}</div>
              </div>
              <span class="badge-class">${student.class}</span>
            </div>
            
            <div class="student-card-stats">
              <div class="stat-row">
                <span class="stat-label">${state.currentLanguage === 'km' ? 'ពិន្ទុមធ្យមភាគ' : 'GPA Average'}</span>
                <span class="stat-value" style="color: var(--primary);">${avg}%</span>
              </div>
              <div class="progress-bar-wrapper">
                <div class="progress-bar-fill" style="width: ${avg}%;"></div>
              </div>
              
              <div class="stat-row" style="margin-top:8px;">
                <span class="stat-label">${state.currentLanguage === 'km' ? 'វត្តមាន (P/A/L)' : 'Attendance (P/A/L)'}</span>
                <span class="stat-value">${student.attendance.Present}/${student.attendance.Absent}/${student.attendance.Late}</span>
              </div>
              
              <button class="btn-primary edit-grades-btn" data-id="${student.id}" style="width:100%;margin-top:12px;padding:8px 0;">
                ${state.currentLanguage === 'km' ? 'កែប្រែពិន្ទុ & វត្តមាន' : 'Edit Grades & Attendance'}
              </button>
            </div>
          </div>
        `;
      }).join('');

      grid.querySelectorAll('.edit-grades-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const studentId = btn.getAttribute('data-id');
          openGradeModal(studentId);
        });
      });
    };

    classSelector.addEventListener('change', updateStudentsList);
    updateStudentsList();
  } else {
    // Parent view
    const child = students.find(s => s.id === state.currentUser.studentId);

    if (!child) {
      el.academicContentContainer.innerHTML = `
        <div class="student-link-widget">
          <h3>⚠️ ${t('noStudentLinked')}</h3>
          <p>${t('noStudentLinkedDesc')}</p>
          <button id="academic-link-trigger-btn" class="btn-primary">${t('linkNow')}</button>
        </div>
      `;
      document.getElementById('academic-link-trigger-btn').addEventListener('click', () => {
        el.modalLinkStudent.classList.add('show');
      });
      return;
    }

    const grades = Object.entries(child.grades);
    let html = `
      <div class="student-detail-view">
        <div class="card-container">
          <h3 class="card-title" style="margin-bottom:20px;">
            ${state.currentLanguage === 'km' ? 'លទ្ធផលសិក្សារបស់ ' + child.nameKH : child.nameEN + "'s Academic Report"}
          </h3>
          <div class="grades-list-container">
    `;

    grades.forEach(([subject, score]) => {
      let scoreClass = 'average';
      if (score >= 85) scoreClass = 'excellent';
      else if (score < 50) scoreClass = 'poor';

      html += `
        <div class="grade-row-item">
          <span class="grade-subject-name">${subject}</span>
          <div class="progress-bar-wrapper">
            <div class="progress-bar-fill" style="width: ${score}%; background-color: ${score >= 85 ? 'var(--success)' : score < 50 ? 'var(--danger)' : 'var(--warning)'};"></div>
          </div>
          <span class="grade-score-pill ${scoreClass}">${score}%</span>
        </div>
      `;
    });

    const totalDays = child.attendance.Present + child.attendance.Absent + child.attendance.Late;
    const attendanceRate = totalDays > 0 ? Math.round((child.attendance.Present / totalDays) * 100) : 100;

    html += `
          </div>
        </div>

        <div style="display:flex; flex-direction:column; gap:24px;">
          <div class="card-container">
            <h3 class="card-title" style="margin-bottom:12px;">${t('remarks')}</h3>
            <p style="font-size:13px; color:var(--text-secondary); line-height:1.6; font-style:italic;">
              "${child.remarks}"
            </p>
          </div>

          <div class="card-container" style="text-align:center;">
            <h3 class="card-title" style="margin-bottom:16px;">${state.currentLanguage === 'km' ? 'របាយការណ៍វត្តមាន' : 'Attendance Summary'}</h3>
            <div style="font-size:32px; font-weight:800; color:var(--success); margin-bottom:8px;">${attendanceRate}%</div>
            <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; font-size:11px; margin-top:16px;">
              <div>
                <div style="color:var(--success); font-weight:700;">${child.attendance.Present}</div>
                <div style="color:var(--text-secondary);">${t('present')}</div>
              </div>
              <div>
                <div style="color:var(--danger); font-weight:700;">${child.attendance.Absent}</div>
                <div style="color:var(--text-secondary);">${t('absent')}</div>
              </div>
              <div>
                <div style="color:var(--warning); font-weight:700;">${child.attendance.Late}</div>
                <div style="color:var(--text-secondary);">${t('late')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    el.academicContentContainer.innerHTML = html;
  }
}

function openGradeModal(studentId) {
  const students = db.getStudents();
  const student = students.find(s => s.id === studentId);
  if (!student) return;

  el.gradeStudentId.value = studentId;
  document.getElementById('modal-grade-title').textContent = `${state.currentLanguage === 'km' ? 'កែពិន្ទុ៖ ' + student.nameKH : 'Edit Grades: ' + student.nameEN}`;

  el.gradeSubject.value = 'Math';
  el.gradeScore.value = student.grades.Math;
  el.studentRemarks.value = student.remarks;

  el.gradeSubject.addEventListener('change', () => {
    const selectedSub = el.gradeSubject.value;
    el.gradeScore.value = student.grades[selectedSub] || 0;
  });

  el.modalGrade.classList.add('show');
}

function handleGradeSubmit(e) {
  e.preventDefault();
  const studentId = el.gradeStudentId.value;
  const subject = el.gradeSubject.value;
  const score = parseInt(el.gradeScore.value);
  const remarks = el.studentRemarks.value.trim();

  const students = db.getStudents();
  const student = students.find(s => s.id === studentId);

  if (student) {
    student.grades[subject] = score;
    student.remarks = remarks;
    db.setStudents(students);

    showToast('Success', t('toastGradeSaved'), 'success');
    el.modalGrade.classList.remove('show');
    renderAcademic();

    if (student.parentId) {
      addNotification(
        student.parentId,
        `Teacher updated score of ${student.nameEN}: ${subject} is now ${score}%`,
        `លោកគ្រូ/អ្នកគ្រូ បានធ្វើបច្ចុប្បន្នភាពពិន្ទុរបស់សិស្ស ${student.nameKH}៖ មុខវិជ្ជា ${subject} គឺ ${score}%`
      );
    }
  }
}

// -------------------------------------------------------------
// ANNOUNCEMENTS
// -------------------------------------------------------------
function renderAnnouncements() {
  const anns = db.getAnnouncements();

  if (anns.length === 0) {
    el.announcementsGrid.innerHTML = `<p style="padding:40px;text-align:center;color:var(--text-secondary)">No announcements posted yet.</p>`;
    return;
  }

  el.announcementsGrid.innerHTML = anns.map(ann => `
    <div class="announcement-card">
      <img class="announcement-img" src="${ann.image || 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600'}" alt="Announcement Image">
      <div class="announcement-body">
        <div class="announcement-badge-row">
          <span class="announcement-category">
            ${state.currentLanguage === 'km' ? ann.categoryKH : ann.categoryEN}
          </span>
          <span class="announcement-date">${formatDate(ann.date)}</span>
        </div>
        <h3 class="announcement-title">
          ${state.currentLanguage === 'km' ? ann.titleKH : ann.titleEN}
        </h3>
        <p class="announcement-content">
          ${state.currentLanguage === 'km' ? ann.contentKH : ann.contentEN}
        </p>
        <div class="announcement-author">
          ✍️ ${ann.author}
        </div>
      </div>
    </div>
  `).join('');
}

function handleAnnouncementSubmit(e) {
  e.preventDefault();
  const titleKh = el.annTitleKh.value.trim();
  const titleEn = el.annTitleEn.value.trim();
  const category = el.annCategory.value;
  const contentKh = el.annContentKh.value.trim();
  const contentEn = el.annContentEn.value.trim();

  const anns = db.getAnnouncements();
  const newAnn = {
    id: `ann_${Date.now()}`,
    titleEN: titleEn,
    titleKH: titleKh,
    contentEN: contentEn,
    contentKH: contentKh,
    date: new Date().toISOString().split('T')[0],
    author: state.currentUser.nameEN,
    categoryEN: category,
    categoryKH: category === 'Events' ? 'ព្រឹត្តិការណ៍' : category === 'Academic' ? 'ការសិក្សា' : 'ទូទៅ',
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600'
  };

  anns.unshift(newAnn);
  db.setAnnouncements(anns);

  showToast('Success', t('toastAnnAdded'), 'success');
  el.modalAnnouncement.classList.remove('show');

  el.annTitleKh.value = '';
  el.annTitleEn.value = '';
  el.annContentKh.value = '';
  el.annContentEn.value = '';

  renderAnnouncements();

  const users = db.getUsers();
  users.filter(u => u.role === 'parent').forEach(parent => {
    addNotification(
      parent.username,
      `New Notice: ${titleEn}`,
      `សេចក្តីប្រកាសថ្មី៖ ${titleKh}`
    );
  });
}

// -------------------------------------------------------------
// STUDENT ID LINKING
// -------------------------------------------------------------
function handleStudentLinkSubmit(e) {
  e.preventDefault();
  const code = el.linkStudentId.value.trim().toUpperCase();

  const students = db.getStudents();
  const student = students.find(s => s.id === code);

  if (student && !student.parentId) {
    student.parentId = state.currentUser.username;
    db.setStudents(students);

    const users = db.getUsers();
    const userMatch = users.find(u => u.username === state.currentUser.username);
    if (userMatch) {
      userMatch.studentId = code;
      db.setUsers(users);
      state.currentUser.studentId = code;
      sessionStorage.setItem('salaconnect_current_user', JSON.stringify(state.currentUser));
    }

    showToast('Success', t('toastStudentLinked'), 'success');
    el.modalLinkStudent.classList.remove('show');
    el.linkStudentId.value = '';

    renderDashboard();
  } else {
    showToast('Error', t('toastLinkError'), 'danger');
  }
}

// -------------------------------------------------------------
// HELPER FORMATTING FUNCTIONS
// -------------------------------------------------------------
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatTime(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  let hours = d.getHours();
  let minutes = d.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${minutes} ${ampm}`;
}

function formatTimeAgo(isoStr) {
  if (!isoStr) return '';
  const diff = Date.now() - new Date(isoStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return state.currentLanguage === 'km' ? 'មុននេះបន្តិច' : 'Just now';
  if (mins < 60) return state.currentLanguage === 'km' ? `${mins} នាទីមុន` : `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return state.currentLanguage === 'km' ? `${hours} ម៉ោងមុន` : `${hours}h ago`;
  return formatDate(isoStr);
}

// -------------------------------------------------------------
// SYSTEM ADMINISTRATOR CONTROLLERS
// -------------------------------------------------------------
function renderAdmin() {
  const users = db.getUsers();
  const students = db.getStudents();

  // Render table content
  filterAdminUsersList();
}

function filterAdminUsersList() {
  const query = el.adminUserSearch.value.toLowerCase().trim();
  const users = db.getUsers();
  const students = db.getStudents();

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(query) ||
    u.nameEN.toLowerCase().includes(query) ||
    u.nameKH.includes(query) ||
    u.email.toLowerCase().includes(query) ||
    u.role.toLowerCase().includes(query)
  );

  el.adminUsersTbody.innerHTML = filteredUsers.map(user => {
    let permText = '';
    if (user.role === 'teacher') {
      const classes = user.classes || [];
      permText = state.currentLanguage === 'km' ? `ថ្នាក់៖ ${classes.join(', ') || 'គ្មាន'}` : `Classes: ${classes.join(', ') || 'None'}`;
    } else if (user.role === 'parent') {
      const student = students.find(s => s.id === user.studentId);
      const studentName = student ? (state.currentLanguage === 'km' ? student.nameKH : student.nameEN) : 'Unlinked';
      permText = state.currentLanguage === 'km' ? `កូន៖ ${studentName} (${user.studentId || 'គ្មាន'})` : `Child: ${studentName} (${user.studentId || 'None'})`;
    } else {
      permText = state.currentLanguage === 'km' ? 'គ្រប់គ្រងពេញលេញ' : 'Full Access';
    }

    const displayName = state.currentLanguage === 'km' ? user.nameKH : user.nameEN;
    const roleBadgeClass = `badge-role-${user.role}`;
    const roleLabel = user.role === 'admin' ? t('admin') : user.role === 'teacher' ? t('teacher') : t('parent');

    // Admin cannot edit or delete themselves to prevent locking out
    const isSelf = user.username === state.currentUser.username;

    return `
      <tr style="border-bottom:1px solid var(--border-color); transition: background-color 0.2s;">
        <td style="padding:12px; display:flex; align-items:center; gap:10px;">
          <img src="${user.avatar}" style="width:30px; height:30px; border-radius:50%; object-fit:cover;">
          <div>
            <div style="font-weight:600;">${displayName}</div>
            <div style="font-size:11px; color:var(--text-secondary);">@${user.username}</div>
          </div>
        </td>
        <td style="padding:12px;">
          <span class="role-badge ${roleBadgeClass}" style="font-size:11px; padding:2px 8px; border-radius:12px; font-weight:600;">${roleLabel}</span>
        </td>
        <td style="padding:12px; color:var(--text-secondary);">${user.email}</td>
        <td style="padding:12px; font-weight:500;">${permText}</td>
        <td style="padding:12px;">
          ${isSelf ? `
            <span style="font-size:11px; color:var(--text-secondary); font-style:italic;">(You)</span>
          ` : `
            <button class="btn-primary edit-perm-btn" data-username="${user.username}" style="padding:4px 8px; font-size:11px; margin-right:4px;">
              ${state.currentLanguage === 'km' ? 'កែសិទ្ធិ' : 'Edit'}
            </button>
            <button class="btn-logout delete-user-btn" data-username="${user.username}" style="padding:4px 8px; font-size:11px; background:var(--danger); border-color:var(--danger); color:white;">
              ${state.currentLanguage === 'km' ? 'លុប' : 'Delete'}
            </button>
          `}
        </td>
      </tr>
    `;
  }).join('');

  // Add event listeners to generated buttons
  el.adminUsersTbody.querySelectorAll('.edit-perm-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const username = btn.getAttribute('data-username');
      openEditPermissionsModal(username);
    });
  });

  el.adminUsersTbody.querySelectorAll('.delete-user-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const username = btn.getAttribute('data-username');
      if (confirm(state.currentLanguage === 'km' ? `តើអ្នកពិតជាចង់លុបគណនី ${username} មែនទេ?` : `Are you sure you want to delete user ${username}?`)) {
        handleDeleteUser(username);
      }
    });
  });
}

function openEditPermissionsModal(username) {
  const users = db.getUsers();
  const user = users.find(u => u.username === username);
  if (!user) return;

  el.permissionsUsername.value = username;
  el.permissionsNewUsername.value = user.username;
  el.permissionsPassword.value = user.password;
  el.permissionsFullname.value = state.currentLanguage === 'km' ? user.nameKH : user.nameEN;
  el.permissionsEmail.value = user.email;

  if (user.role === 'teacher') {
    el.permissionsClassesGroup.style.display = 'block';
    el.permissionsStudentGroup.style.display = 'none';
    el.permissionsClasses.value = (user.classes || []).join(', ');
  } else if (user.role === 'parent') {
    el.permissionsClassesGroup.style.display = 'none';
    el.permissionsStudentGroup.style.display = 'block';
    el.permissionsStudentId.value = user.studentId || '';
  } else {
    el.permissionsClassesGroup.style.display = 'none';
    el.permissionsStudentGroup.style.display = 'none';
  }

  el.modalPermissions.classList.add('show');
}

function handlePermissionSave(e) {
  e.preventDefault();
  const originalUsername = el.permissionsUsername.value;
  const newUsername = el.permissionsNewUsername.value.trim().toLowerCase();
  const password = el.permissionsPassword.value.trim();
  const fullname = el.permissionsFullname.value.trim();
  const email = el.permissionsEmail.value.trim();

  const users = db.getUsers();

  // If username has changed, check for conflicts
  if (originalUsername !== newUsername && users.some(u => u.username === newUsername)) {
    showToast('Error', 'Username is already taken!', 'danger');
    return;
  }

  const user = users.find(u => u.username === originalUsername);

  if (user) {
    user.username = newUsername;
    user.password = password;
    if (state.currentLanguage === 'km') {
      user.nameKH = fullname;
    } else {
      user.nameEN = fullname;
    }
    user.email = email;

    if (user.role === 'teacher') {
      const classInput = el.permissionsClasses.value.trim();
      user.classes = classInput ? classInput.split(',').map(c => c.trim().toUpperCase()).filter(Boolean) : [];
    } else if (user.role === 'parent') {
      const oldStudentId = user.studentId;
      const newStudentId = el.permissionsStudentId.value.trim().toUpperCase();

      if (oldStudentId !== newStudentId) {
        const students = db.getStudents();

        // Remove link from old student
        if (oldStudentId) {
          const oldStudent = students.find(s => s.id === oldStudentId);
          if (oldStudent) oldStudent.parentId = '';
        }

        // Add link to new student
        if (newStudentId) {
          const newStudent = students.find(s => s.id === newStudentId);
          if (newStudent) {
            newStudent.parentId = newUsername; // link with the new username
          } else {
            showToast('Warning', 'Student code not found in registry!', 'warning');
          }
        }
        user.studentId = newStudentId;
        db.setStudents(students);
      } else if (originalUsername !== newUsername) {
        // Link students to the updated parent username if student ID didn't change
        const students = db.getStudents();
        students.forEach(s => {
          if (s.parentId === originalUsername) s.parentId = newUsername;
        });
        db.setStudents(students);
      }
    }

    // Migrate other DB references if username changed
    if (originalUsername !== newUsername) {
      // 1. Update message sender/receiver
      const messages = db.getMessages();
      messages.forEach(m => {
        if (m.sender === originalUsername) m.sender = newUsername;
        if (m.receiver === originalUsername) m.receiver = newUsername;
      });
      db.setMessages(messages);

      // 2. Update notifications recipient
      const notifications = db.getNotifications();
      notifications.forEach(n => {
        if (n.recipient === originalUsername) n.recipient = newUsername;
      });
      db.setNotifications(notifications);

      // 3. Update active session details if editing self
      if (state.currentUser && state.currentUser.username === originalUsername) {
        state.currentUser.username = newUsername;
        state.currentUser.nameEN = user.nameEN;
        state.currentUser.nameKH = user.nameKH;
        state.currentUser.email = user.email;
        state.currentUser.password = user.password;
        sessionStorage.setItem('salaconnect_current_user', JSON.stringify(state.currentUser));
      }
    }

    db.setUsers(users);
    showToast('Success', t('toastPermUpdated'), 'success');
    el.modalPermissions.classList.remove('show');
    renderAdmin();
  }
}

function handleAdminCreateUser(e) {
  e.preventDefault();
  const username = el.adminNewUsername.value.trim().toLowerCase();
  const fullname = el.adminNewFullname.value.trim();
  const role = el.adminNewRole.value;
  const password = el.adminNewPassword.value.trim();
  const studentId = el.adminNewStudentId.value.trim().toUpperCase();

  const users = db.getUsers();
  if (users.some(u => u.username === username)) {
    showToast('Error', 'Username already exists!', 'danger');
    return;
  }

  const newUser = {
    username,
    nameEN: fullname,
    nameKH: fullname,
    email: `${username}@school.edu.kh`,
    password,
    role,
    avatar: role === 'admin' ? "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150" :
      role === 'teacher' ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150" :
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
  };

  if (role === 'parent') {
    newUser.studentId = studentId;
    if (studentId) {
      const students = db.getStudents();
      const student = students.find(s => s.id === studentId);
      if (student) {
        student.parentId = username;
        db.setStudents(students);
      } else {
        showToast('Warning', 'Student code not found in registry!', 'warning');
      }
    }
  } else if (role === 'teacher') {
    newUser.classes = [];
  }

  users.push(newUser);
  db.setUsers(users);

  showToast('Success', t('toastUserCreated'), 'success');

  // Reset form
  el.adminCreateUserForm.reset();
  el.adminNewStudentGroup.style.display = 'none';
  renderAdmin();
}

function handleDeleteUser(username) {
  let users = db.getUsers();
  const user = users.find(u => u.username === username);

  if (user) {
    // Unlink student if parent is deleted
    if (user.role === 'parent' && user.studentId) {
      const students = db.getStudents();
      const student = students.find(s => s.id === user.studentId);
      if (student) {
        student.parentId = '';
        db.setStudents(students);
      }
    }

    users = users.filter(u => u.username !== username);
    db.setUsers(users);

    showToast('Success', t('toastUserDeleted'), 'danger');
    renderAdmin();
  }
}

// -------------------------------------------------------------
// CLASS DIRECTORY CONTROLLER
// -------------------------------------------------------------
function renderDirectory() {
  const users = db.getUsers();
  const students = db.getStudents();
  const currentUser = state.currentUser;

  if (!currentUser) return;

  let html = '';
  const query = el.directorySearchInput.value.trim().toLowerCase();

  if (currentUser.role === 'teacher') {
    // Show class selector and delete all button
    el.directoryClassSelector.style.display = 'block';
    el.directoryDeleteAllBtn.style.display = 'block';

    // Populate select options if empty
    if (el.directoryClassSelector.children.length === 0) {
      const teacherClasses = currentUser.classes || [];
      el.directoryClassSelector.innerHTML = teacherClasses.map(c => `
        <option value="${c}">${c}</option>
      `).join('');
    }

    const selectedClass = el.directoryClassSelector.value;
    if (!selectedClass) {
      el.directoryDeleteAllBtn.style.display = 'none';
      el.directoryListGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary);">
          ${state.currentLanguage === 'km' ? 'គ្មានថ្នាក់គ្រប់គ្រងឡើយ' : 'No classes assigned.'}
        </div>
      `;
      return;
    }

    // Filter students by class and search query
    let filteredStudents = students.filter(s => s.class === selectedClass);
    if (query) {
      filteredStudents = filteredStudents.filter(s =>
        s.nameEN.toLowerCase().includes(query) ||
        s.nameKH.includes(query) ||
        s.id.toLowerCase().includes(query)
      );
    }

    if (filteredStudents.length === 0) {
      el.directoryListGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary);">
          ${state.currentLanguage === 'km' ? 'រកមិនឃើញសិស្សឡើយ' : 'No students found.'}
        </div>
      `;
      return;
    }

    html = filteredStudents.map(student => {
      // Find linked parent user details
      const parentUser = users.find(u => u.role === 'parent' && u.studentId === student.id);
      const studentName = state.currentLanguage === 'km' ? student.nameKH : student.nameEN;

      let parentHTML = '';
      if (parentUser) {
        const parentName = state.currentLanguage === 'km' ? parentUser.nameKH : parentUser.nameEN;
        parentHTML = `
          <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 12px; margin-top: 12px; border-top: 1px solid var(--border-color);">
            <div style="display: flex; align-items: center; gap: 8px;">
              <img src="${parentUser.avatar}" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover;">
              <div style="font-size: 12px;">
                <div style="font-weight: 600;">${parentName}</div>
                <div style="font-size: 10px; color: var(--text-secondary);">${state.currentLanguage === 'km' ? 'អាណាព្យាបាល' : 'Guardian'}</div>
              </div>
            </div>
            <button class="btn-primary start-chat-directory-btn" data-recipient="${parentUser.username}" style="padding: 4px 8px; font-size: 11px;">
              ${state.currentLanguage === 'km' ? 'ជជែកពិភាក្សា' : 'Chat'}
            </button>
          </div>
        `;
      } else {
        parentHTML = `
          <div style="padding-top: 12px; margin-top: 12px; border-top: 1px solid var(--border-color); font-size: 11px; color: var(--text-secondary); font-style: italic; text-align: center;">
            ${state.currentLanguage === 'km' ? 'មិនទាន់ភ្ជាប់គណនីអាណាព្យាបាល' : 'Guardian not linked yet'}
          </div>
        `;
      }

      return `
        <div class="card-container" style="padding: 16px; border: 1px solid var(--card-border); border-radius: var(--radius-md);">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px;">
              ${studentName.charAt(0)}
            </div>
            <div>
              <h4 style="margin: 0; font-size: 14px; font-weight: 600;">${studentName}</h4>
              <div style="font-size: 11px; color: var(--text-secondary);">ID: ${student.id} | Class: ${student.class}</div>
            </div>
          </div>
          ${parentHTML}
          <div style="display:flex; justify-content: flex-end; gap:8px; margin-top:12px; padding-top:12px; border-top:1px dashed var(--border-color);">
            <button class="btn-primary edit-student-directory-btn" data-id="${student.id}" style="padding:4px 8px; font-size:11px; background:var(--secondary); border-color:var(--secondary);">
              ${state.currentLanguage === 'km' ? 'កែសម្រួល' : 'Edit'}
            </button>
            <button class="btn-logout delete-student-directory-btn" data-id="${student.id}" style="padding:4px 8px; font-size:11px; background:var(--danger); border-color:var(--danger); color:white;">
              ${state.currentLanguage === 'km' ? 'លុប' : 'Delete'}
            </button>
          </div>
        </div>
      `;
    }).join('');

  } else if (currentUser.role === 'parent') {
    // Hide class selector and delete all button
    el.directoryClassSelector.style.display = 'none';
    el.directoryDeleteAllBtn.style.display = 'none';

    // Find parent child
    const child = students.find(s => s.id === currentUser.studentId);
    if (!child) {
      el.directoryListGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary);">
          ${state.currentLanguage === 'km' ? 'សូមភ្ជាប់ទំនាក់ទំនងកូដសិស្សជាមុនសិន' : 'Please link your child student profile first.'}
        </div>
      `;
      return;
    }

    const classmateClass = child.class;

    // 1. Get Teachers managing this class
    const classTeachers = users.filter(u => u.role === 'teacher' && (u.classes || []).includes(classmateClass));

    // 2. Filter classmates by query
    let classStudents = students.filter(s => s.class === classmateClass && s.id !== child.id);
    if (query) {
      classStudents = classStudents.filter(s =>
        s.nameEN.toLowerCase().includes(query) ||
        s.nameKH.includes(query) ||
        s.id.toLowerCase().includes(query)
      );
    }

    let teachersSection = '';
    if (classTeachers.length > 0) {
      teachersSection = `
        <div style="grid-column: 1/-1; margin-top: 10px; margin-bottom: 5px;">
          <h4 style="margin: 0; font-weight: 600; font-size: 14px; color: var(--primary);">
            ${state.currentLanguage === 'km' ? 'លោកគ្រូអ្នកគ្រូបង្រៀនថ្នាក់ ' + classmateClass : 'Class ' + classmateClass + ' Teachers'}
          </h4>
        </div>
      ` + classTeachers.map(teacher => {
        const teacherName = state.currentLanguage === 'km' ? teacher.nameKH : teacher.nameEN;
        return `
          <div class="card-container" style="padding: 16px; border: 1px solid var(--primary-light); background: rgba(59, 130, 246, 0.02); border-radius: var(--radius-md);">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <img src="${teacher.avatar}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
                <div>
                  <h4 style="margin: 0; font-size: 14px; font-weight: 600;">${teacherName}</h4>
                  <div style="font-size: 11px; color: var(--text-secondary);">${teacher.email}</div>
                </div>
              </div>
              <button class="btn-primary start-chat-directory-btn" data-recipient="${teacher.username}" style="padding: 6px 12px; font-size: 11px;">
                ${state.currentLanguage === 'km' ? 'ផ្ញើសារ' : 'Message'}
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    let classmatesSection = `
      <div style="grid-column: 1/-1; margin-top: 20px; margin-bottom: 5px;">
        <h4 style="margin: 0; font-weight: 600; font-size: 14px; color: var(--text-primary);">
          ${state.currentLanguage === 'km' ? 'មិត្តរួមថ្នាក់ និងអាណាព្យាបាល' : 'Classmates & Parents'}
        </h4>
      </div>
    `;

    if (classStudents.length === 0) {
      classmatesSection += `
        <div style="grid-column: 1/-1; text-align: center; padding: 20px; color: var(--text-secondary); font-style: italic;">
          ${state.currentLanguage === 'km' ? 'គ្មានមិត្តរួមថ្នាក់ផ្សេងទៀតទេ' : 'No other classmates found.'}
        </div>
      `;
    } else {
      classmatesSection += classStudents.map(student => {
        const studentName = state.currentLanguage === 'km' ? student.nameKH : student.nameEN;
        const parentUser = users.find(u => u.role === 'parent' && u.studentId === student.id);

        let parentHTML = '';
        if (parentUser) {
          const parentName = state.currentLanguage === 'km' ? parentUser.nameKH : parentUser.nameEN;
          parentHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 12px; margin-top: 12px; border-top: 1px solid var(--border-color);">
              <div style="display: flex; align-items: center; gap: 8px;">
                <img src="${parentUser.avatar}" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover;">
                <div style="font-size: 12px;">
                  <div style="font-weight: 600;">${parentName}</div>
                  <div style="font-size: 10px; color: var(--text-secondary);">${state.currentLanguage === 'km' ? 'អាណាព្យាបាល' : 'Guardian'}</div>
                </div>
              </div>
              <button class="btn-primary start-chat-directory-btn" data-recipient="${parentUser.username}" style="padding: 4px 8px; font-size: 11px; background-color: var(--secondary); border-color: var(--secondary);">
                ${state.currentLanguage === 'km' ? 'សួរនាំ' : 'Chat'}
              </button>
            </div>
          `;
        } else {
          parentHTML = `
            <div style="padding-top: 12px; margin-top: 12px; border-top: 1px solid var(--border-color); font-size: 11px; color: var(--text-secondary); font-style: italic; text-align: center;">
              ${state.currentLanguage === 'km' ? 'មិនទាន់ភ្ជាប់គណនីអាណាព្យាបាល' : 'Guardian not linked yet'}
            </div>
          `;
        }

        return `
          <div class="card-container" style="padding: 16px; border: 1px solid var(--card-border); border-radius: var(--radius-md);">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(16, 185, 129, 0.05); color: #10b981; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px;">
                ${studentName.charAt(0)}
              </div>
              <div>
                <h4 style="margin: 0; font-size: 14px; font-weight: 600;">${studentName}</h4>
                <div style="font-size: 11px; color: var(--text-secondary);">Classmate | Class: ${student.class}</div>
              </div>
            </div>
            ${parentHTML}
          </div>
        `;
      }).join('');
    }

    html = teachersSection + classmatesSection;
  }

  el.directoryListGrid.innerHTML = html;

  // Bind click handlers to newly created "Chat" buttons
  el.directoryListGrid.querySelectorAll('.start-chat-directory-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const recipient = btn.getAttribute('data-recipient');
      state.activeChatRecipient = recipient;
      switchView('messages');

      // Update active navigation item in sidebar
      const navLinks = [
        { link: el.linkDashboard, item: el.navDashboard },
        { link: el.linkMessages, item: el.navMessages },
        { link: el.linkAcademic, item: el.navAcademic },
        { link: el.linkAnnouncements, item: el.navAnnouncements },
        { link: el.linkDirectory, item: el.navDirectory },
        { link: el.linkSettings, item: el.navSettings }
      ];
      navLinks.forEach(l => {
        if (l.item) l.item.classList.remove('active');
      });
      el.navMessages.classList.add('active');
    });
  });

  // Bind click handlers to "Edit" classmate buttons
  el.directoryListGrid.querySelectorAll('.edit-student-directory-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const studentId = btn.getAttribute('data-id');
      openEditStudentModal(studentId);
    });
  });

  // Bind click handlers to "Delete" classmate buttons
  el.directoryListGrid.querySelectorAll('.delete-student-directory-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const studentId = btn.getAttribute('data-id');
      if (confirm(state.currentLanguage === 'km' ? `តើអ្នកពិតជាចង់លុបព័ត៌មានសិស្ស ${studentId} មែនទេ?` : `Are you sure you want to delete student ${studentId}?`)) {
        handleDeleteStudent(studentId);
      }
    });
  });
}

// -------------------------------------------------------------
// EXCEL IMPORT AND TEMPLATE DOWNLOAD HANDLERS
// -------------------------------------------------------------
function handleDownloadExcelTemplate() {
  if (typeof XLSX === 'undefined') {
    showToast('Error', 'Excel library (SheetJS) failed to load. Please check your internet connection.', 'danger');
    return;
  }

  const wsData = [
    ["Student ID", "Name KH", "Name EN", "Class", "Parent Username"],
    ["STU005", "សុខ ម៉ានិត", "Sok Manit", "12A", ""],
    ["STU006", "ហេង ធីតា", "Heng Thida", "11B", "parent1"]
  ];

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Students Template");

  XLSX.writeFile(wb, "SalaConnect_Students_Template.xlsx");
  showToast('Success', 'Excel Template downloaded!', 'success');
}

function handleExcelImport(e) {
  if (typeof XLSX === 'undefined') {
    showToast('Error', 'Excel library (SheetJS) failed to load. Please check your internet connection.', 'danger');
    return;
  }

  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (evt) {
    try {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (rows.length < 2) {
        showToast('Error', 'Uploaded spreadsheet is empty!', 'danger');
        return;
      }

      // Check header columns (index 0)
      const headers = rows[0].map(h => String(h || '').trim().toLowerCase());
      const idIdx = headers.indexOf("student id");
      const khIdx = headers.indexOf("name kh");
      const enIdx = headers.indexOf("name en");
      const classIdx = headers.indexOf("class");
      const parentIdx = headers.indexOf("parent username");

      if (idIdx === -1 || khIdx === -1 || enIdx === -1 || classIdx === -1) {
        showToast('Error', 'Invalid Excel headers. Must contain: Student ID, Name KH, Name EN, Class', 'danger');
        return;
      }

      let students = db.getStudents();
      let users = db.getUsers();
      let importedCount = 0;
      let skippedCount = 0;

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.length === 0) continue;

        const id = String(row[idIdx] || '').trim().toUpperCase();
        const nameKH = String(row[khIdx] || '').trim();
        const nameEN = String(row[enIdx] || '').trim();
        const className = String(row[classIdx] || '').trim().toUpperCase();
        const parentUsername = parentIdx !== -1 ? String(row[parentIdx] || '').trim().toLowerCase() : '';

        // Validate basic fields
        if (!id || !nameKH || !nameEN || !className) {
          skippedCount++;
          continue;
        }

        // Check if student ID already exists
        const existingStudent = students.find(s => s.id === id);

        const newStudent = {
          id: id,
          nameKH: nameKH,
          nameEN: nameEN,
          class: className,
          parentId: parentUsername || '',
          grades: existingStudent ? existingStudent.grades : { Math: 0, Khmer: 0, Physics: 0, Chemistry: 0, Biology: 0 },
          attendance: existingStudent ? existingStudent.attendance : { Present: 0, Absent: 0, Late: 0 },
          remarks: existingStudent ? existingStudent.remarks : ""
        };

        if (existingStudent) {
          // Update student information
          Object.assign(existingStudent, newStudent);
        } else {
          // Insert new student
          students.push(newStudent);
        }

        // Link with parent user if parentUsername is set
        if (parentUsername) {
          const parentUser = users.find(u => u.username === parentUsername && u.role === 'parent');
          if (parentUser) {
            parentUser.studentId = id;
          }
        }

        importedCount++;
      }

      db.setStudents(students);
      db.setUsers(users);

      showToast('Success', `Imported/Updated ${importedCount} students! (Skipped ${skippedCount})`, 'success');

      // Reset input element
      el.adminImportFile.value = '';

      // If we are currently rendering the admin view, update it
      if (state.activeView === 'admin') renderAdmin();
    } catch (err) {
      console.error(err);
      showToast('Error', 'Failed to parse Excel file.', 'danger');
    }
  };

  reader.readAsArrayBuffer(file);
}

// -------------------------------------------------------------
// CLASSMATE DIRECTORY MODIFICATION CONTROLLERS
// -------------------------------------------------------------
function openEditStudentModal(studentId) {
  const students = db.getStudents();
  const student = students.find(s => s.id === studentId);
  if (!student) return;

  el.studentEditOriginalId.value = studentId;
  el.studentEditId.value = studentId;
  el.studentEditNameKh.value = student.nameKH;
  el.studentEditNameEn.value = student.nameEN;
  el.studentEditClass.value = student.class;

  el.modalStudentEdit.classList.add('show');
}

function handleStudentEditSave(e) {
  e.preventDefault();
  const originalId = el.studentEditOriginalId.value;
  const nameKH = el.studentEditNameKh.value.trim();
  const nameEN = el.studentEditNameEn.value.trim();
  const className = el.studentEditClass.value.trim().toUpperCase();

  const students = db.getStudents();
  const student = students.find(s => s.id === originalId);

  if (student) {
    student.nameKH = nameKH;
    student.nameEN = nameEN;
    student.class = className;

    db.setStudents(students);
    showToast('Success', 'Student details updated!', 'success');
    el.modalStudentEdit.classList.remove('show');
    renderDirectory();
  }
}

function handleDeleteStudent(studentId) {
  let students = db.getStudents();
  const student = students.find(s => s.id === studentId);

  if (student) {
    // Unlink any parent associated with this student
    const users = db.getUsers();
    const parent = users.find(u => u.role === 'parent' && u.studentId === studentId);
    if (parent) {
      parent.studentId = '';
      db.setUsers(users);
    }

    students = students.filter(s => s.id !== studentId);
    db.setStudents(students);

    showToast('Success', 'Student deleted successfully!', 'danger');
    renderDirectory();
  }
}

function handleDirectoryDeleteAll() {
  const selectedClass = el.directoryClassSelector.value;
  if (!selectedClass) return;

  const warningMsg = state.currentLanguage === 'km' ?
    `តើអ្នកពិតជាចង់លុបសិស្សទាំងអស់នៅក្នុងថ្នាក់ ${selectedClass} មែនទេ?` :
    `Are you sure you want to delete all students in class ${selectedClass}?`;

  if (confirm(warningMsg)) {
    let students = db.getStudents();
    const studentsToDelete = students.filter(s => s.class === selectedClass);

    // Unlink all parents associated with the deleted students
    const users = db.getUsers();
    studentsToDelete.forEach(s => {
      const parent = users.find(u => u.role === 'parent' && u.studentId === s.id);
      if (parent) parent.studentId = '';
    });
    db.setUsers(users);

    // Filter out classmates of the selected class
    students = students.filter(s => s.class !== selectedClass);
    db.setStudents(students);

    showToast('Success', `All students in class ${selectedClass} have been deleted.`, 'danger');
    renderDirectory();
  }
}

// -------------------------------------------------------------
// MULTIMEDIA MESSAGE CONTROLLERS
// -------------------------------------------------------------
function sendMultimediaMessage(content, type, isGroup) {
  const allMsgs = db.getMessages();
  const newMsg = {
    id: `msg_${Date.now()}`,
    sender: state.currentUser.username,
    receiver: state.activeChatRecipient,
    text: content,
    type: type,
    timestamp: new Date().toISOString(),
    isGroup: isGroup
  };

  allMsgs.push(newMsg);
  db.setMessages(allMsgs);

  // Send background alerts if private
  if (!isGroup) {
    const previewText = type === 'image' ? 'Sent an image' : (type === 'audio' ? 'Sent a voice message' : 'Sent a sticker');
    addNotification(
      state.activeChatRecipient,
      `${state.currentUser.nameEN} ${previewText}`,
      `${state.currentUser.nameKH} បានផ្ញើ${type === 'image' ? 'រូបភាព' : (type === 'audio' ? 'សារសម្លេង' : 'ស្ទីកឃ័រ')}`
    );
  }

  renderMessages();
}

function handleChatImageSelected(e, isGroup) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onloadend = () => {
    sendMultimediaMessage(reader.result, 'image', isGroup);
  };
  reader.readAsDataURL(file);
  e.target.value = ''; // Reset file input
}

let mediaRecorder = null;
let audioChunks = [];
let isRecording = false;

function toggleVoiceRecording(isGroup) {
  const voiceBtn = document.getElementById('chat-voice-btn');
  const dot = document.getElementById('voice-recording-dot');

  if (!isRecording) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      fallbackVoiceRecording(isGroup);
      return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        mediaRecorder.ondataavailable = e => {
          audioChunks.push(e.data);
        };
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.onloadend = () => {
            sendMultimediaMessage(reader.result, 'audio', isGroup);
          };
          reader.readAsDataURL(audioBlob);

          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        isRecording = true;
        dot.style.display = 'block';
        voiceBtn.style.background = 'var(--danger-light)';
        voiceBtn.style.color = 'var(--danger)';
        showToast('Info', 'Recording started... Click mic again to stop.', 'info');
      })
      .catch(err => {
        console.warn('Microphone permission blocked/unavailable. Using fallback.', err);
        fallbackVoiceRecording(isGroup);
      });
  } else {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    isRecording = false;
    dot.style.display = 'none';
    voiceBtn.style.background = '';
    voiceBtn.style.color = '';
  }
}

function fallbackVoiceRecording(isGroup) {
  const voiceBtn = document.getElementById('chat-voice-btn');
  const dot = document.getElementById('voice-recording-dot');

  isRecording = true;
  dot.style.display = 'block';
  voiceBtn.style.background = 'var(--danger-light)';
  voiceBtn.style.color = 'var(--danger)';
  showToast('Info', 'Recording simulated voice (2s)...', 'info');

  setTimeout(() => {
    const mockAudioBase64 = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==";
    sendMultimediaMessage(mockAudioBase64, 'audio', isGroup);

    isRecording = false;
    dot.style.display = 'none';
    voiceBtn.style.background = '';
    voiceBtn.style.color = '';
    showToast('Success', 'Voice message sent!', 'success');
  }, 2000);
}

function toggleStickerPicker() {
  const picker = document.getElementById('chat-sticker-picker');
  if (!picker) return;
  const isGroup = /^\d+[A-Z]$/.test(state.activeChatRecipient);

  if (picker.style.display === 'none') {
    const stickers = [
      { name: "Excellent", url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23FFD700"/><polygon points="50,15 62,38 88,41 68,59 74,85 50,71 26,85 32,59 12,41 38,38" fill="%23FFF"/></svg>` },
      { name: "ThumbsUp", url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%234CAF50"/><text x="50" y="65" font-size="45" text-anchor="middle">👍</text></svg>` },
      { name: "Heart", url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23E91E63"/><path d="M50,30 C50,30 45,20 35,20 C25,20 20,28 20,38 C20,53 50,75 50,75 C50,75 80,53 80,38 C80,28 75,20 65,20 C55,20 50,30 50,30 Z" fill="%23FFF"/></svg>` },
      { name: "Trophy", url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23FF9800"/><text x="50" y="65" font-size="45" text-anchor="middle">🏆</text></svg>` },
      { name: "GradCap", url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%232196F3"/><text x="50" y="65" font-size="45" text-anchor="middle">🎓</text></svg>` },
      { name: "Rocket", url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%239C27B0"/><text x="50" y="65" font-size="45" text-anchor="middle">🚀</text></svg>` }
    ];

    picker.innerHTML = stickers.map(s => `
      <div class="sticker-item" data-url="${encodeURIComponent(s.url)}" style="cursor: pointer; padding: 6px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: center; background: var(--bg-primary); transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1.0)'">
        <img src="${s.url}" style="width: 48px; height: 48px; object-fit: contain;">
      </div>
    `).join('');

    picker.style.display = 'grid';

    picker.querySelectorAll('.sticker-item').forEach(item => {
      item.addEventListener('click', () => {
        const url = decodeURIComponent(item.getAttribute('data-url'));
        sendMultimediaMessage(url, 'sticker', isGroup);
        picker.style.display = 'none';
      });
    });
  } else {
    picker.style.display = 'none';
  }
}

// Play notification sound chime (G5 then C6) via browser's Web Audio API
function playNotificationSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const playTone = (freq, startTime, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    // Play chime tones
    playTone(783.99, ctx.currentTime, 0.12); // G5
    playTone(1046.50, ctx.currentTime + 0.08, 0.22); // C6
  } catch (err) {
    console.warn("Web Audio API not allowed or failed:", err);
  }
}

// -------------------------------------------------------------
// GOOGLE SHEETS SYNCHRONIZATION CONTROLLERS
// -------------------------------------------------------------
function syncDatabaseToGoogleSheets() {
  const url = el.settingGSheetUrl.value.trim();
  if (!url) {
    showToast('Error', state.currentLanguage === 'km' ? 'សូមបញ្ចូលតំណភ្ជាប់ Apps Script Web App URL ត្រឹមត្រូវ។' : 'Please enter a valid Apps Script Web App URL.', 'danger');
    return;
  }

  // Save the URL preference
  localStorage.setItem('salaconnect_gsheet_url', url);

  // Gather database collections
  const payload = {
    users: db.getUsers(),
    students: db.getStudents(),
    messages: db.getMessages(),
    announcements: db.getAnnouncements(),
    notifications: db.getNotifications()
  };

  el.settingGSheetSyncBtn.textContent = state.currentLanguage === 'km' ? 'កំពុងរក្សាទុក...' : 'Syncing...';
  el.settingGSheetSyncBtn.disabled = true;

  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' }, // Avoids pre-flight CORS issues
    body: JSON.stringify(payload)
  })
    .then(res => {
      showToast('Success', state.currentLanguage === 'km' ? 'រក្សាទុកទិន្នន័យទៅ Google Sheets រួចរាល់!' : 'Database synced to Google Sheets!', 'success');
    })
    .catch(err => {
      console.error(err);
      showToast('Error', state.currentLanguage === 'km' ? 'ការតភ្ជាប់ទៅកាន់ Google Sheets បានបរាជ័យ!' : 'Failed to connect to Google Sheets Web App.', 'danger');
    })
    .finally(() => {
      el.settingGSheetSyncBtn.textContent = state.currentLanguage === 'km' ? 'រក្សាទុកទិន្នន័យទៅ Sheets' : 'Sync Data to Sheets';
      el.settingGSheetSyncBtn.disabled = false;
    });
}

function restoreDatabaseFromGoogleSheets() {
  const url = el.settingGSheetUrl.value.trim();
  if (!url) {
    showToast('Error', state.currentLanguage === 'km' ? 'សូមបញ្ចូលតំណភ្ជាប់ Apps Script Web App URL ត្រឹមត្រូវ។' : 'Please enter a valid Apps Script Web App URL.', 'danger');
    return;
  }

  // Save the URL preference
  localStorage.setItem('salaconnect_gsheet_url', url);

  el.settingGSheetRestoreBtn.textContent = state.currentLanguage === 'km' ? 'កំពុងទាញយក...' : 'Restoring...';
  el.settingGSheetRestoreBtn.disabled = true;

  fetch(url)
    .then(res => res.json())
    .then(result => {
      if (result.status === 'success' && result.data) {
        const data = result.data;
        if (data.users && data.users.length > 0) db.setUsers(data.users);
        if (data.students && data.students.length > 0) db.setStudents(data.students);
        if (data.messages && data.messages.length > 0) db.setMessages(data.messages);
        if (data.announcements && data.announcements.length > 0) db.setAnnouncements(data.announcements);
        if (data.notifications && data.notifications.length > 0) db.setNotifications(data.notifications);

        showToast('Success', state.currentLanguage === 'km' ? 'បានស្ដារទិន្នន័យពី Google Sheets ជោគជ័យ!' : 'Database restored from Google Sheets!', 'success');

        // Reload page after a delay to reflect changes
        setTimeout(() => {
          // Reset session storage to match updated local database
          sessionStorage.removeItem('salaconnect_current_user');
          location.reload();
        }, 1500);
      } else {
        showToast('Error', state.currentLanguage === 'km' ? 'ទិន្នន័យពី Google Sheets មិនត្រឹមត្រូវឡើយ!' : 'Invalid data returned from Google Sheets.', 'danger');
      }
    })
    .catch(err => {
      console.error(err);
      showToast('Error', state.currentLanguage === 'km' ? 'ការតភ្ជាប់ទាញយកទិន្នន័យបានបរាជ័យ!' : 'Failed to retrieve data from Google Sheets.', 'danger');
    })
    .finally(() => {
      el.settingGSheetRestoreBtn.textContent = state.currentLanguage === 'km' ? 'ទាញយកទិន្នន័យពី Sheets' : 'Restore Data from Sheets';
      el.settingGSheetRestoreBtn.disabled = false;
    });
}
