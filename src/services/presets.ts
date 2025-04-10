import {Preset, FolderStructure} from "../interfaces/preset.interface";

export const presets: Preset[] = [
    {
        id: 0,
        name: "Нет",
        structure: {
            folders: [],
            files: [],
            subfolders: {}
        }
    },
    {
        id: 1,
        name: 'Шаблон для изучения языка программирования',
        structure: {
            folders: ['исходники', 'документация', 'тесты'],
            files: ['README.md', 'главная.md'],
            subfolders: {
                исходники: {
                    folders: ['основной', 'утилиты'],
                    files: ['основной.md', 'утилиты.md'],
                    subfolders: {
                        основной: {
                            folders: [],
                            files: ['пример_основного.md'],
                            subfolders: {},
                        },
                        утилиты: {
                            folders: [],
                            files: ['пример_утилит.md'],
                            subfolders: {},
                        },
                    },
                },
                документация: {
                    folders: ['введение', 'продвинутое'],
                    files: ['введение.md', 'продвинутое.md'],
                    subfolders: {
                        введение: {
                            folders: [],
                            files: ['пример_введения.md'],
                            subfolders: {},
                        },
                        продвинутое: {
                            folders: [],
                            files: ['пример_продвинутого.md'],
                            subfolders: {},
                        },
                    },
                },
                тесты: {
                    folders: ['модульные', 'интеграционные'],
                    files: ['модульные_тесты.md', 'интеграционные_тесты.md'],
                    subfolders: {
                        модульные: {
                            folders: [],
                            files: ['пример_модульного_теста.md'],
                            subfolders: {},
                        },
                        интеграционные: {
                            folders: [],
                            files: ['пример_интеграционного_теста.md'],
                            subfolders: {},
                        },
                    },
                },
            },
        },
    },
    {
        id: 3,
        name: 'Шаблон для обучения в вузе',
        structure: {
            folders: ['лекции', 'задания', 'ресурсы', 'проекты', 'экзамены', 'личные_заметки'],
            files: ['README.md', 'план_курса.md'],
            subfolders: {
                лекции: {
                    folders: ['неделя1', 'неделя2', 'неделя3'],
                    files: ['введение.md'],
                    subfolders: {
                        неделя1: {
                            folders: ['слайды', 'конспекты'],
                            files: ['конспект_неделя1.md'],
                            subfolders: {
                                слайды: {
                                    folders: [],
                                    files: ['презентация_неделя1.md'],
                                    subfolders: {},
                                },
                                конспекты: {
                                    folders: [],
                                    files: ['чтения_неделя1.md'],
                                    subfolders: {},
                                },
                            },
                        },
                        неделя2: {
                            folders: ['слайды', 'конспекты'],
                            files: ['конспект_неделя2.md'],
                            subfolders: {
                                слайды: {
                                    folders: [],
                                    files: ['презентация_неделя2.md'],
                                    subfolders: {},
                                },
                                конспекты: {
                                    folders: [],
                                    files: ['чтения_неделя2.md'],
                                    subfolders: {},
                                },
                            },
                        },
                        неделя3: {
                            folders: ['слайды', 'конспекты'],
                            files: ['конспект_неделя3.md'],
                            subfolders: {
                                слайды: {
                                    folders: [],
                                    files: ['презентация_неделя3.md'],
                                    subfolders: {},
                                },
                                конспекты: {
                                    folders: [],
                                    files: ['чтения_неделя3.md'],
                                    subfolders: {},
                                },
                            },
                        },
                    },
                },
                задания: {
                    folders: ['задание1', 'задание2'],
                    files: ['критерии_оценки.md'],
                    subfolders: {
                        задание1: {
                            folders: [],
                            files: ['условие_задачи.md'],
                            subfolders: {},
                        },
                        задание2: {
                            folders: [],
                            files: ['условие_задачи.md'],
                            subfolders: {},
                        },
                    },
                },
                ресурсы: {
                    folders: ['книги', 'статьи'],
                    files: ['материалы_курса.md'],
                    subfolders: {
                        книги: {
                            folders: [],
                            files: ['список_книг.md'],
                            subfolders: {},
                        },
                        статьи: {
                            folders: [],
                            files: ['список_статей.md'],
                            subfolders: {},
                        },
                    },
                },
                проекты: {
                    folders: ['проект1', 'проект2'],
                    files: ['описание_проектов.md'],
                    subfolders: {
                        проект1: {
                            folders: ['документация', 'код'],
                            files: ['техническое_задание.md'],
                            subfolders: {
                                документация: {
                                    folders: [],
                                    files: ['план.md'],
                                    subfolders: {},
                                },
                                код: {
                                    folders: [],
                                    files: ['пример_реализации.md'],
                                    subfolders: {},
                                },
                            },
                        },
                        проект2: {
                            folders: ['документация', 'код'],
                            files: ['техническое_задание.md'],
                            subfolders: {
                                документация: {
                                    folders: [],
                                    files: ['план.md'],
                                    subfolders: {},
                                },
                                код: {
                                    folders: [],
                                    files: ['пример_реализации.md'],
                                    subfolders: {},
                                },
                            },
                        },
                    },
                },
                экзамены: {
                    folders: ['промежуточный', 'итоговый'],
                    files: ['подготовка.md'],
                    subfolders: {
                        промежуточный: {
                            folders: [],
                            files: ['вопросы.md', 'ответы.md'],
                            subfolders: {},
                        },
                        итоговый: {
                            folders: [],
                            files: ['вопросы.md', 'ответы.md'],
                            subfolders: {},
                        },
                    },
                },
                личные_заметки: {
                    folders: ['мысли', 'цитаты', 'ссылки'],
                    files: ['заметки_общие.md'],
                    subfolders: {
                        мысли: {
                            folders: [],
                            files: ['наблюдения.md'],
                            subfolders: {},
                        },
                        цитаты: {
                            folders: [],
                            files: ['интересные_цитаты.md'],
                            subfolders: {},
                        },
                        ссылки: {
                            folders: [],
                            files: ['полезные_ссылки.md'],
                            subfolders: {},
                        },
                    },
                },
            },
        },
    },
    {
        id: 4,
        name: 'Шаблон для кулинарии',
        structure: {
            folders: ['завтраки', 'обеды', 'ужины', 'десерты', 'напитки', 'любимые', 'на заметку'],
            files: ['README.md', 'идеи_для_меню.md'],
            subfolders: {
                завтраки: {
                    folders: [],
                    files: [],
                    subfolders: {}
                },
                обеды: {
                    folders: [],
                    files: [],
                    subfolders: {}
                },
                ужины: {
                    folders: [],
                    files: [],
                    subfolders: {}
                },
                десерты: {
                    folders: [],
                    files: [],
                    subfolders: {}
                },
                напитки: {
                    folders: [],
                    files: [],
                    subfolders: {}
                },
                любимые: {
                    folders: [],
                    files: [],
                    subfolders: {}
                },
                'на заметку': {
                    folders: ['техники', 'замены', 'полезное'],
                    files: ['советы.md'],
                    subfolders: {
                        техники: {
                            folders: [],
                            files: [],
                            subfolders: {}
                        },
                        замены: {
                            folders: [],
                            files: [],
                            subfolders: {}
                        },
                        полезное: {
                            folders: [],
                            files: [],
                            subfolders: {}
                        }
                    }
                }
            }
        }
    },
    {
        id: 5,
        name: 'Шаблон для личного дневника и саморазвития',
        structure: {
            folders: ['дневник', 'цели', 'рефлексия', 'идеи', 'мотивация', 'чтение'],
            files: ['README.md', 'структура_работы.md'],
            subfolders: {
                дневник: {
                    folders: ['по дням', 'по неделям'],
                    files: [],
                    subfolders: {
                        'по дням': {
                            folders: [],
                            files: [],
                            subfolders: {}
                        },
                        'по неделям': {
                            folders: [],
                            files: [],
                            subfolders: {}
                        }
                    }
                },
                цели: {
                    folders: ['год', 'месяц', 'неделя'],
                    files: ['общие_цели.md'],
                    subfolders: {
                        год: {
                            folders: [],
                            files: [],
                            subfolders: {}
                        },
                        месяц: {
                            folders: [],
                            files: [],
                            subfolders: {}
                        },
                        неделя: {
                            folders: [],
                            files: [],
                            subfolders: {}
                        }
                    }
                },
                рефлексия: {
                    folders: ['успехи', 'трудности'],
                    files: ['общая_оценка.md'],
                    subfolders: {
                        успехи: {
                            folders: [],
                            files: [],
                            subfolders: {}
                        },
                        трудности: {
                            folders: [],
                            files: [],
                            subfolders: {}
                        }
                    }
                },
                идеи: {
                    folders: ['проекты', 'мысли', 'наблюдения'],
                    files: [],
                    subfolders: {
                        проекты: {
                            folders: [],
                            files: [],
                            subfolders: {}
                        },
                        мысли: {
                            folders: [],
                            files: [],
                            subfolders: {}
                        },
                        наблюдения: {
                            folders: [],
                            files: [],
                            subfolders: {}
                        }
                    }
                },
                мотивация: {
                    folders: ['цитаты', 'вдохновение'],
                    files: ['мотивационный_план.md'],
                    subfolders: {
                        цитаты: {
                            folders: [],
                            files: [],
                            subfolders: {}
                        },
                        вдохновение: {
                            folders: [],
                            files: [],
                            subfolders: {}
                        }
                    }
                },
                чтение: {
                    folders: ['книги', 'заметки', 'списки'],
                    files: [],
                    subfolders: {
                        книги: {
                            folders: [],
                            files: [],
                            subfolders: {}
                        },
                        заметки: {
                            folders: [],
                            files: [],
                            subfolders: {}
                        },
                        списки: {
                            folders: [],
                            files: [],
                            subfolders: {}
                        }
                    }
                }
            }
        }
    },
    {
        id: 6,
        name: 'Шаблон для путешествий и поездок',
        structure: {
            folders: ['планы', 'поездки', 'впечатления', 'памятки', 'любимые места', 'фотоальбом'],
            files: ['README.md', 'глобальные_идеи.md'],
            subfolders: {
                планы: {
                    folders: ['страны', 'города', 'бюджеты'],
                    files: ['желания.md'],
                    subfolders: {
                        страны: {
                            folders: [],
                            files: [],
                            subfolders: {}
                        },
                        города: {
                            folders: [],
                            files: [],
                            subfolders: {}
                        },
                        бюджеты: {
                            folders: [],
                            files: ['пример_бюджета.md'],
                            subfolders: {}
                        }
                    }
                },
                поездки: {
                    folders: ['2023', '2024', 'будущие'],
                    files: ['архив.md'],
                    subfolders: {
                        '2023': {
                            folders: [],
                            files: [],
                            subfolders: {}
                        },
                        '2024': {
                            folders: [],
                            files: [],
                            subfolders: {}
                        },
                        'будущие': {
                            folders: [],
                            files: [],
                            subfolders: {}
                        }
                    }
                },
                впечатления: {
                    folders: ['по странам', 'по темам'],
                    files: [],
                    subfolders: {
                        'по странам': {
                            folders: [],
                            files: [],
                            subfolders: {}
                        },
                        'по темам': {
                            folders: [],
                            files: [],
                            subfolders: {}
                        }
                    }
                },
                памятки: {
                    folders: ['документы', 'чеклисты', 'советы'],
                    files: [],
                    subfolders: {
                        документы: {
                            folders: [],
                            files: ['паспорт.md', 'визы.md'],
                            subfolders: {}
                        },
                        чеклисты: {
                            folders: [],
                            files: ['чеклист_поездки.md'],
                            subfolders: {}
                        },
                        советы: {
                            folders: [],
                            files: ['лайфхаки.md'],
                            subfolders: {}
                        }
                    }
                },
                'любимые места': {
                    folders: ['рестораны', 'парки', 'музеи'],
                    files: ['заметки.md'],
                    subfolders: {
                        рестораны: {
                            folders: [],
                            files: [],
                            subfolders: {}
                        },
                        парки: {
                            folders: [],
                            files: [],
                            subfolders: {}
                        },
                        музеи: {
                            folders: [],
                            files: [],
                            subfolders: {}
                        }
                    }
                },
                фотоальбом: {
                    folders: ['по годам', 'по странам'],
                    files: [],
                    subfolders: {
                        'по годам': {
                            folders: [],
                            files: [],
                            subfolders: {}
                        },
                        'по странам': {
                            folders: [],
                            files: [],
                            subfolders: {}
                        }
                    }
                }
            }
        }
    }
];
