
export interface API {
    name: string
    path: string
}

export interface APIGroup extends API {
    children: API[]
}

export const APIs: APIGroup[] = [
    {
        name: 'Pokemon',
        path: 'pokemon',
        children: [
            {
                name: 'Types',
                path: `types`
            },
            {
                name: 'Pokemons',
                path: 'pokemons',
            }
        ]
    },
    {
        name: 'Miyasaki',
        path: 'miyasaki',
        children: [
            {
                name: 'Films',
                path: 'films',
            },
            {
                name: 'Heros',
                path: 'heros',
            }
        ]
    },
    {
        name: 'Music',
        path: 'music',
        children: [
            {
                name: 'Groupes',
                path: 'groupes',
            },
            {
                name: 'Albums',
                path: 'albums',
            }
        ]
    },
    {
        name: 'Ocean',
        path: 'ocean',
        children: [
            {
                name: 'Espèces',
                path: 'especes',
            },
            {
                name: 'Poissons',
                path: 'poissons',
            }
        ]
    },
    {
        name: 'Shop',
        path: 'shop',
        children: [
            {
                name: 'Clients',
                path: 'clients',
            },
            {
                name: 'Commandes',
                path: 'commandes',
            }
        ]
    },
    {
        name: 'Basketball',
        path: 'basketball',
        children: [
            {
                name: 'Équipes',
                path: 'equipes',
            },
            {
                name: 'Joueurs',
                path: 'joueurs',
            },
        ],
    },
    {
        name: 'UHA40',
        path: 'UHA40',
        children: [
            {
                name: 'Années',
                path: 'annees'
            },
            {
                name: 'Certifications',
                path: 'certifications'
            },
        ]
    },
    {
        name: 'BrowseShop',
        path: 'browseShop',
        children: [
            {
                name: 'Catégories',
                path: 'categories'
            },
            {
                name: 'Produits',
                path: 'produits'
            },
        ]
    },
    {
        name: 'UNIX',
        path: 'UNIX',
        children: [
            {
                name: 'Utilisateurs',
                path: 'utilisateurs'
            },
            {
                name: 'Images',
                path: 'images'
            },
        ]
    },
    {
        name: 'Car',
        path: 'car',
        children: [
            {
                name: 'Constructeurs',
                path: 'constructeurs'
            },
            {
                name: 'Voitures',
                path: 'voitures'
            },
        ]
    },
    {
        name: 'Arbres',
        path: 'arbres',
        children: [
            {
                name: 'Types',
                path: 'types'
            },
            {
                name: 'Espèces',
                path: 'especes'
            },
        ]
    },
    {
        name: 'Livres',
        path: 'livres',
        children: [
            {
                name: 'Auteurs',
                path: 'auteurs'
            },
            {
                name: 'Livres',
                path: 'livres'
            },
        ]
    },
]
