import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoadingState } from '../interfaces/loading-state.interface';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    private loadingState = new BehaviorSubject<LoadingState>({});
    private buttonLoadingState = new BehaviorSubject<Record<string, boolean>>({});

    startLoading(section: string): void {
        const currentState = this.loadingState.value;
        const newState = {
            ...currentState,
            [section]: true
        };
        this.loadingState.next(newState);
    }

    stopLoading(section: string): void {
        const currentState = this.loadingState.value;
        const newState = {
            ...currentState,
            [section]: false
        };
        this.loadingState.next(newState);
    }

    isLoading$(section: string): Observable<boolean> {
        return new Observable<boolean>(observer => {
            return this.loadingState.subscribe(state => {
                const isLoading = state[section] || false;
                observer.next(isLoading);
            });
        });
    }

    isLoadingSync(section: string): boolean {
        const isLoading = this.loadingState.value[section] || false;
        return isLoading;
    }

    setButtonLoading(buttonId: string, loading: boolean): void {
        const currentState = this.buttonLoadingState.value;
        const newState = {
            ...currentState,
            [buttonId]: loading
        };
        this.buttonLoadingState.next(newState);
    }

    isButtonLoading$(buttonId: string): Observable<boolean> {
        return new Observable<boolean>(observer => {
            return this.buttonLoadingState.subscribe(state => {
                const isLoading = state[buttonId] || false;
                observer.next(isLoading);
            });
        });
    }

    isButtonLoadingSync(buttonId: string): boolean {
        const isLoading = this.buttonLoadingState.value[buttonId] || false;
        return isLoading;
    }

    resetAll(): void {
        this.loadingState.next({});
        this.buttonLoadingState.next({});
    }
}
