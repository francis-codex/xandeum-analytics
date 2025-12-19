/**
 * Circuit Breaker Pattern for Failing Nodes
 *
 * Prevents repeated requests to nodes that are known to be failing,
 * improving overall performance by failing fast.
 */

interface CircuitState {
  failures: number;
  lastFailure: number;
  isOpen: boolean;
}

export class CircuitBreaker {
  private circuits: Map<string, CircuitState> = new Map();
  private readonly failureThreshold: number;
  private readonly resetTimeout: number; // ms

  constructor(failureThreshold = 2, resetTimeout = 60000) {
    this.failureThreshold = failureThreshold;
    this.resetTimeout = resetTimeout;
  }

  /**
   * Check if circuit is open (endpoint is failing)
   */
  isOpen(endpoint: string): boolean {
    const circuit = this.circuits.get(endpoint);
    if (!circuit || !circuit.isOpen) {
      return false;
    }

    // Check if enough time has passed to try again (half-open state)
    const now = Date.now();
    if (now - circuit.lastFailure > this.resetTimeout) {
      // Reset to half-open state (allow one attempt)
      circuit.isOpen = false;
      circuit.failures = 0;
      return false;
    }

    return true;
  }

  /**
   * Record a failure for an endpoint
   */
  recordFailure(endpoint: string): void {
    const circuit = this.circuits.get(endpoint) || {
      failures: 0,
      lastFailure: 0,
      isOpen: false,
    };

    circuit.failures++;
    circuit.lastFailure = Date.now();

    if (circuit.failures >= this.failureThreshold) {
      circuit.isOpen = true;
    }

    this.circuits.set(endpoint, circuit);
  }

  /**
   * Record a success for an endpoint
   */
  recordSuccess(endpoint: string): void {
    // Reset the circuit on success
    this.circuits.delete(endpoint);
  }

  /**
   * Get failure count for an endpoint
   */
  getFailureCount(endpoint: string): number {
    return this.circuits.get(endpoint)?.failures || 0;
  }

  /**
   * Get all open circuits (failing endpoints)
   */
  getOpenCircuits(): string[] {
    const now = Date.now();
    return Array.from(this.circuits.entries())
      .filter(([_, circuit]) => {
        return circuit.isOpen && now - circuit.lastFailure <= this.resetTimeout;
      })
      .map(([endpoint]) => endpoint);
  }

  /**
   * Reset all circuits
   */
  reset(): void {
    this.circuits.clear();
  }
}

// Singleton instance
export const circuitBreaker = new CircuitBreaker(2, 60000); // 2 failures, 60s timeout
