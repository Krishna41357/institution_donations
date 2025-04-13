module MyModule::AlumniDonation {

    use aptos_framework::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;

    struct DonationPool has store, key {
        total_donations: u64,
    }

    /// Initializes the donation pool for an institution.
    public entry fun init_donation_pool(admin: &signer) {
        move_to(admin, DonationPool { total_donations: 0 });
    }

    /// Allows alumni to donate AptosCoin to the institution.
    public entry fun donate(donor: &signer, institution: address, amount: u64) acquires DonationPool {
        let pool = borrow_global_mut<DonationPool>(institution);
        let donation = coin::withdraw<AptosCoin>(donor, amount);
        coin::deposit<AptosCoin>(institution, donation);
        pool.total_donations = pool.total_donations + amount;
    }
}
