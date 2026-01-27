import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

export const mockDataInterceptor: HttpInterceptorFn = (req, next) => {
    // Only intercept mock API calls (port 9999 as defined in environment)
    if (req.url.includes('localhost:9999')) {
        console.log('[MockInterceptor] Handling:', req.url);

        // Determine what to return based on URL
        let body: any = {};

        if (req.url.includes('/questions')) {
            // Mock simple questions for any game
            body = [
                {
                    id: 'q1',
                    text: '1 + 1 = ?',
                    answers: [
                        { id: 'a1', text: '1', isCorrect: false },
                        { id: 'a2', text: '2', isCorrect: true },
                        { id: 'a3', text: '3', isCorrect: false }
                    ]
                }
            ];
        } else if (req.url.includes('/subjects')) {
            body = [{ id: 'math', name: 'Toán Học' }, { id: 'vietnamese', name: 'Tiếng Việt' }];
        } else {
            body = { success: true, message: 'Mock response from interceptor' };
        }

        return of(new HttpResponse({ status: 200, body })).pipe(delay(500));
    }

    return next(req);
};
