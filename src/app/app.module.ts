import {APP_INITIALIZER, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppComponent } from './app.component';
import {initializeApiEndpoints} from "../api/v1/endpoints";
import {ApiEndpointsService} from "../api/api.service";

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, '../assets/localization/i18n/', '.json');
}

@NgModule({
    declarations: [],
    imports: [
        BrowserModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        AppComponent
    ],
    providers: [
        ApiEndpointsService,
        {
            provide: APP_INITIALIZER,
            useFactory: initializeApiEndpoints,
            deps: [ApiEndpointsService],
            multi: true,
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
