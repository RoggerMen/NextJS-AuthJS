import "next-auth";

declare module "next-auth" {
  interface Session {
    provider?: string; // Añade la propiedad `provider` al tipo Session
  }
}