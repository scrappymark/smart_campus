<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= special_chars($title) ?></title>
    <link rel="icon" type="image/png" href="<?= asset('images/favicon.ico') ?>" sizes="16x16">
    <!-- remix icon font css  -->
    <link rel="stylesheet" href="<?= asset('css/remixicon.css') ?>">
    <!-- BootStrap css -->
    <link rel="stylesheet" href="<?= asset('css/lib/bootstrap.min.css') ?>">
    <!-- Apex Chart css -->
    <link rel="stylesheet" href="<?= asset('css/lib/apexcharts.css') ?>">
    <!-- Data Table css -->
    <link rel="stylesheet" href="<?= asset('css/lib/dataTables.min.css') ?>">
    <!-- Text Editor css -->
    <link rel="stylesheet" href="<?= asset('css/lib/editor-katex.min.css') ?>">
    <link rel="stylesheet" href="<?= asset('css/lib/editor.atom-one-dark.min.css') ?>">
    <link rel="stylesheet" href="<?= asset('css/lib/editor.quill.snow.css') ?>">
    <!-- Date picker css -->
    <link rel="stylesheet" href="<?= asset('css/lib/flatpickr.min.css') ?>">
    <!-- Calendar css -->
    <link rel="stylesheet" href="<?= asset('css/lib/full-calendar.css') ?>">
    <!-- Vector Map css -->
    <link rel="stylesheet" href=" <?= asset('css/lib/jquery-jvectormap-2.0.5.css') ?>">
    <!-- Popup css -->
    <link rel="stylesheet" href="<?= asset('css/lib/magnific-popup.css') ?>">
    <!-- Slick Slider css -->
    <link rel="stylesheet" href="<?= asset('css/lib/slick.css') ?>">
    <!-- prism css -->
    <link rel="stylesheet" href="<?= asset('css/lib/prism.css') ?>">
    <!-- file upload css -->
    <link rel="stylesheet" href="<?= asset('css/lib/file-upload.css') ?>">

    <link rel="stylesheet" href="<?= asset('css/lib/audioplayer.css') ?>">
    <!-- main css -->
    <link rel="stylesheet" href="<?= asset('css/style.css') ?>">

    <?php echo (isset($style) ? $style   : '') ?>

</head>