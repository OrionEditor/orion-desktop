import {ProjectType} from "../../../interfaces/project-types.inerface";

export const PROJECT_TYPES: ProjectType[] = [
    {
        id: "local",
        icon: "../assets/icons/svg/project-types/local.svg",
        header: "Локальное хранилище",
        description: "Хранилище данных на вашем устройстве"
    },
    {
        id: "remote",
        icon: "../assets/icons/svg/project-types/remote.svg",
        header: "Удаленное хранилище",
        description: "Хранилище данных на удаленном сервере"
    },
    {
        id: "protected",
        icon: "../assets/icons/svg/project-types/protected.svg",
        header: "Защищенное хранилище",
        description: "Зашифрованное хранилище для конфиденциальных данных"
    }
];
