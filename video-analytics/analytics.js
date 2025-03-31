// analytics.js

class AnalyticsClient {
    constructor(serverUrl = 'http://localhost:3000') {
      this.serverUrl = serverUrl;
      this.queue = [];
      this.flushInterval = null;
      this.isOnline = navigator.onLine;
      
      // Setup online/offline listeners
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.flushQueue();
      });
      
      window.addEventListener('offline', () => {
        this.isOnline = false;
      });
      
      // Setup flush interval
      this.startFlushInterval();
      
      // Flush before page unload
      window.addEventListener('beforeunload', () => this.flushQueue());
    }
    
    // Track an event
    track(eventName, eventData = {}) {
      const event = {
        eventName,
        eventData,
        timestamp: new Date().toISOString(),
        sessionId: this.getSessionId(),
        url: window.location.href,
        userAgent: navigator.userAgent
      };
      
      this.queue.push(event);
      
      // If queue gets too large or we're online, flush immediately
      if (this.isOnline && (this.queue.length >= 10)) {
        this.flushQueue();
      }
    }
    
    // Get or create session ID
    getSessionId() {
      let sessionId = sessionStorage.getItem('analytics_session_id');
      if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
        sessionStorage.setItem('analytics_session_id', sessionId);
      }
      return sessionId;
    }
    
    // Start interval to periodically flush the queue
    startFlushInterval() {
      this.flushInterval = setInterval(() => {
        if (this.isOnline && this.queue.length > 0) {
          this.flushQueue();
        }
      }, 30000); // Flush every 30 seconds if there's data
    }
    
    // Send data to the server
    async flushQueue() {
      if (this.queue.length === 0) return;
      
      const events = [...this.queue];
      this.queue = [];
      
      try {
        const endpoint = events.length === 1 
          ? '/api/analytics'
          : '/api/analytics/batch';
          
        const payload = events.length === 1 ? events[0] : events;
        
        const response = await fetch(this.serverUrl + endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
          // Put events back in queue if request failed
          this.queue = [...events, ...this.queue];
          console.error('Failed to send analytics data');
        }
      } catch (error) {
        // Put events back in queue if request failed
        this.queue = [...events, ...this.queue];
        console.error('Error sending analytics data:', error);
      }
    }
  }
  
  // Usage example
  const analytics = new AnalyticsClient('http://your-analytics-server.com');
  
  // Track page view
  analytics.track('pageview');
  
  // Track custom event
  analytics.track('button_click', { 
    buttonId: 'submit-form',
    buttonText: 'Submit' 
  });