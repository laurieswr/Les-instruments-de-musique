<?php
// 🔹 Activer CORS pour permettre l'accès depuis React
function ajouter_headers_cors() {
    add_filter('rest_pre_serve_request', function ($value) {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");
        return $value;
    });
}
add_action('init', 'ajouter_headers_cors');

// 🔹 Charger React dans WordPress
function ajouter_script_react() {
    wp_enqueue_script(
        'instruments-react',
        get_template_directory_uri() . '/js/bundle.js',
        [],
        false,
        true
    );
}
add_action('wp_enqueue_scripts', 'ajouter_script_react');

// 🔹 Enregistrer les routes REST API pour les instruments
add_action('rest_api_init', function () {
    register_rest_route('wp/v2', 'instrument-musique', [
        'methods'  => 'GET',
        'callback' => 'get_instruments',
        'permission_callback' => '__return_true'
    ]);

    register_rest_route('wp/v2', 'instrument-musique/add', [
        'methods'  => 'POST',
        'callback' => 'add_instrument',
        'permission_callback' => '__return_true'
    ]);
});

// 🔹 Récupération des instruments depuis Pods
function get_instruments() {
    $pod = pods('instruments-musiques');

    if (!$pod) {
        return new WP_Error('pod_not_found', 'Le Pod instruments-musiques est introuvable', ['status' => 500]);
    }

    $instruments = $pod->find();
    $data = [];

    while ($instruments->fetch()) {
        $image_id = $pod->field('image');
        $image_url = 'image' => wp_get_attachment_url($pod->field('image')),


        $data[] = [
            'id'          => $pod->id(),
            'nom'         => $pod->field('nom_de_linstrument'),
            'description' => $pod->field('description_de_linstrument'),
            'image'       => $image_url,
            'taille'      => $pod->field('taille_de_linstrument'),
            'morceau'     => $pod->field('morceau'),
            'categorie'   => $pod->field('categorie_de_linstrument'),
        ];
    }

    return rest_ensure_response($data);
}

// 🔹 Ajouter un nouvel instrument via l'API
function add_instrument($request) {
    $params = $request->get_json_params();

    if (empty($params['nom']) || empty($params['description']) || empty($params['categorie'])) {
        return new WP_Error('missing_fields', 'Le nom, la description et la catégorie sont requis', ['status' => 400]);
    }

    $pod = pods('instruments-musiques');
    if (!$pod) {
        return new WP_Error('pod_not_found', 'Le Pod instruments-musiques est introuvable', ['status' => 500]);
    }

    $new_id = $pod->add([
        'nom_de_linstrument'         => sanitize_text_field($params['nom']),
        'description_de_linstrument' => sanitize_textarea_field($params['description']),
        'image'                      => isset($params['image']) ? esc_url_raw($params['image']) : '',
        'taille_de_linstrument'      => sanitize_text_field($params['taille']),
        'morceau'                    => sanitize_text_field($params['morceau']),
        'categorie_de_linstrument'   => sanitize_text_field($params['categorie']),
    ]);


    if (!$new_id) {
        return new WP_Error('add_failed', 'Échec de l’ajout', ['status' => 500]);
    }

    return rest_ensure_response(['message' => 'Instrument ajouté avec succès', 'id' => $new_id]);
}

// 🔹 Sécurisation JWT (si besoin d'authentification)
define('JWT_AUTH_SECRET_KEY', 'ta_cle_secrete_ultra_securisee');
define('JWT_AUTH_CORS_ENABLE', true);
