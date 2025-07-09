<aside class="sidebar">
    <button type="button" class="sidebar-close-btn">
        <iconify-icon icon="radix-icons:cross-2"></iconify-icon>
    </button>
    <div>
        <a href="index.php" class="sidebar-logo d-flex justify-content-center">
            <img src="<?= asset('images/logo.png') ?>" alt="site logo" class="light-logo">
            <img src="<?= asset('images/logo-light.png') ?>" alt="site logo" class="dark-logo">
            <img src="<?= asset('images/logo-icon.png') ?>" alt="site logo" class="logo-icon" style="width: 40px; height: 40px;">
        </a>
    </div>
    <div class="sidebar-menu-area">
        <ul class="sidebar-menu" id="sidebar-menu">
            <li>
                <a href="<?= view('admin.index') ?>">
                    <iconify-icon icon="solar:home-smile-angle-outline" class="menu-icon"></iconify-icon>
                    <span>Dashboard</span>
                </a>
            </li>
            <li class="sidebar-menu-group-title">Management</li>
            <li>
                <a href="<?= view('admin.map-editor') ?>">
                    <iconify-icon icon="solar:streets-map-point-outline" class="menu-icon"></iconify-icon>
                    <span>Map Editor</span>
                </a>
            </li>
        </ul>
    </div>
</aside>