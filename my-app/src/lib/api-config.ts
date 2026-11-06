/**
 * Dynamic API Configuration & Ecosystem Endpoint Resolver
 * Automatically adapts all microservice URLs to match the host from which
 * the user is accessing the application (VPN IP, LAN IP, domain, or localhost).
 */

export function getHost(): string {
  if (typeof window !== "undefined") {
    return window.location.hostname;
  }
  return "localhost";
}

export function getProtocol(): string {
  if (typeof window !== "undefined") {
    return window.location.protocol;
  }
  return "http:";
}

/**
 * Gotti Backend Core API (Port 10000)
 */
export function getBackendBaseUrl(): string {
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:10000`;
  }
  // Server-Side (Next.js SSR inside Docker container): route directly to internal container DNS
  return process.env.INTERNAL_BACKEND_URL || "http://gotti-backend:10000";
}

export function getBackendApiUrl(): string {
  return `${getBackendBaseUrl()}/api`;
}

/**
 * Gotti Visualize & Chart API (Port 8000)
 */
export function getVisualizeBaseUrl(): string {
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:8000`;
  }
  // Server-Side (Next.js SSR inside Docker container): route directly to internal container DNS
  return process.env.INTERNAL_VISUALIZE_URL || "http://gotti-visualize:8000";
}

export function getVisualizeApiUrl(): string {
  return `${getVisualizeBaseUrl()}/api`;
}

/**
 * Stock Alchemist News & Signal Coordinator (Port 8080)
 */
export function getStockAlchemistUrl(): string {
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:8080`;
  }
  // Server-Side (Next.js SSR inside Docker container): route directly to internal container DNS
  return process.env.INTERNAL_STOCK_ALCHEMIST_URL || "http://stock-alchemist:8080";
}

/**
 * Grams Nutrition App (Port 5000)
 */
export function getGramsUrl(): string {
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:5000`;
  }
  return process.env.INTERNAL_GRAMS_URL || process.env.NEXT_PUBLIC_GRAMS_URL || "http://localhost:5000";
}
