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
        name: 'Пресет для изучения языка',
        structure: {
            folders: ['src', 'docs', 'tests'],
            files: ['README.md', 'index.md'],
            subfolders: {
                src: {
                    folders: ['main', 'utils'],
                    files: ['main.md', 'utils.md'],
                    subfolders: {
                        main: {
                            folders: [],
                            files: ['main_example.md'],
                            subfolders: {},
                        },
                        utils: {
                            folders: [],
                            files: ['utils_example.md'],
                            subfolders: {},
                        },
                    },
                },
                docs: {
                    folders: ['intro', 'advanced'],
                    files: ['intro.md', 'advanced.md'],
                    subfolders: {
                        intro: {
                            folders: [],
                            files: ['intro_example.md'],
                            subfolders: {},
                        },
                        advanced: {
                            folders: [],
                            files: ['advanced_example.md'],
                            subfolders: {},
                        },
                    },
                },
                tests: {
                    folders: ['unit', 'integration'],
                    files: ['unit_tests.md', 'integration_tests.md'],
                    subfolders: {
                        unit: {
                            folders: [],
                            files: ['unit_test_example.md'],
                            subfolders: {},
                        },
                        integration: {
                            folders: [],
                            files: ['integration_test_example.md'],
                            subfolders: {},
                        },
                    },
                },
            },
        },
    },
    {
        id: 2,
        name: 'Пресет для веб-разработки',
        structure: {
            folders: ['src', 'assets', 'tests'],
            files: ['README.md', 'index.md'],
            subfolders: {
                src: {
                    folders: ['components', 'services'],
                    files: ['index.md'],
                    subfolders: {
                        components: {
                            folders: ['navbar', 'footer'],
                            files: ['navbar.md', 'footer.md'],
                            subfolders: {},
                        },
                        services: {
                            folders: ['api', 'auth'],
                            files: ['api.md', 'auth.md'],
                            subfolders: {},
                        },
                    },
                },
                assets: {
                    folders: ['images', 'styles'],
                    files: ['favicon.md'],
                    subfolders: {
                        images: {
                            folders: [],
                            files: ['logo.png'],
                            subfolders: {},
                        },
                        styles: {
                            folders: [],
                            files: ['style.css'],
                            subfolders: {},
                        },
                    },
                },
                tests: {
                    folders: ['unit', 'integration'],
                    files: ['unit_tests.md', 'integration_tests.md'],
                    subfolders: {
                        unit: {
                            folders: [],
                            files: ['unit_test_example.md'],
                            subfolders: {},
                        },
                        integration: {
                            folders: [],
                            files: ['integration_test_example.md'],
                            subfolders: {},
                        },
                    },
                },
            },
        },
    },
    {
        id: 3,
        name: 'Пресет для обучения в вузе',
        structure: {
            folders: ['lectures', 'assignments', 'resources'],
            files: ['README.md', 'course_outline.md'],
            subfolders: {
                lectures: {
                    folders: ['week1', 'week2', 'week3'],
                    files: ['intro.md'],
                    subfolders: {
                        week1: {
                            folders: ['slides', 'notes'],
                            files: ['week1_notes.md'],
                            subfolders: {
                                slides: {
                                    folders: [],
                                    files: ['week1_slide_deck.md'],
                                    subfolders: {}
                                },
                                notes: {
                                    folders: [],
                                    files: ['week1_readings.md'],
                                    subfolders: {}
                                }
                            }
                        },
                        week2: {
                            folders: ['slides', 'notes'],
                            files: ['week2_notes.md'],
                            subfolders: {
                                slides: {
                                    folders: [],
                                    files: ['week2_slide_deck.md'],
                                    subfolders: {}
                                },
                                notes: {
                                    folders: [],
                                    files: ['week2_readings.md'],
                                    subfolders: {}
                                }
                            }
                        },
                        week3: {
                            folders: ['slides', 'notes'],
                            files: ['week3_notes.md'],
                            subfolders: {
                                slides: {
                                    folders: [],
                                    files: ['week3_slide_deck.md'],
                                    subfolders: {}
                                },
                                notes: {
                                    folders: [],
                                    files: ['week3_readings.md'],
                                    subfolders: {}
                                }
                            }
                        }
                    }
                },
                assignments: {
                    folders: ['assignment1', 'assignment2'],
                    files: ['grading_rubric.md'],
                    subfolders: {
                        assignment1: {
                            folders: [],
                            files: ['problem_set.md'],
                            subfolders: {}
                        },
                        assignment2: {
                            folders: [],
                            files: ['problem_set.md'],
                            subfolders: {}
                        }
                    }
                },
                resources: {
                    folders: ['books', 'articles'],
                    files: ['course_materials.md'],
                    subfolders: {
                        books: {
                            folders: [],
                            files: ['book_list.md'],
                            subfolders: {}
                        },
                        articles: {
                            folders: [],
                            files: ['article_list.md'],
                            subfolders: {}
                        }
                    }
                }
            }
        }
    }
];
