import { Routes } from "@angular/router";
import {StartPageComponent} from "../ui/pages/start-page/start-page.component";
import {CreateProjectPageComponent} from "../ui/pages/create-project-page/create-project-page.component";

export const routes: Routes = [
    { path: '', component: StartPageComponent },
    {path: 'create-project', component: CreateProjectPageComponent}
];
