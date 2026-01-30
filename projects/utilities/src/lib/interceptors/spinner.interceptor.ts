// import { HttpInterceptorFn } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { finalize } from 'rxjs/operators';
// import { BYPASS_SPINNER } from './constant/http-tokens-interceptor';
// // import { NgxSpinnerService } from 'ngx-spinner';

// export const spinnerInterceptor: HttpInterceptorFn = (req, next) => {
//   const bypassSpinner = req.context.get(BYPASS_SPINNER);
//   const spinnerService: NgxSpinnerService = inject(NgxSpinnerService);
//   if (bypassSpinner) {
//     spinnerService.show();
//   }

//   return next(req).pipe(finalize(() => spinnerService.hide()));
// };
