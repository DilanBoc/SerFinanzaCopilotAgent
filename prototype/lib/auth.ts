export type Role = "advisor" | "admin" | "supervisor" | "marketing";

export type DemoUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  title: string;
};

export const demoUsers: DemoUser[] = [
  {
    id: "user_advisor",
    name: "Laura Martinez",
    email: "asesor@demo.com",
    password: "demo123",
    role: "advisor",
    title: "Asesora de oficina",
  },
  {
    id: "user_admin",
    name: "Carolina Rivas",
    email: "admin@demo.com",
    password: "demo123",
    role: "admin",
    title: "Administradora del sistema",
  },
  {
    id: "user_supervisor",
    name: "Mauricio Gomez",
    email: "supervisor@demo.com",
    password: "demo123",
    role: "supervisor",
    title: "Supervisor de calidad",
  },
  {
    id: "user_marketing",
    name: "Valentina Ruiz",
    email: "marketing@demo.com",
    password: "demo123",
    role: "marketing",
    title: "Marketing y contenido",
  },
];

export function routeForRole(role: Role) {
  if (role === "advisor") return "/advisor";
  if (role === "supervisor") return "/quality";
  if (role === "marketing") return "/marketing";
  return "/admin";
}

export function allowedRoutes(role: Role) {
  if (role === "admin") return ["/advisor", "/quality", "/admin", "/marketing"];
  return [routeForRole(role)];
}
