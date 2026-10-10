package com.nightdrop.initializer;

import com.nightdrop.entity.*;
import com.nightdrop.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final StoreRepository storeRepository;
    private final ProductRepository productRepository;
    private final AddressRepository addressRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           StoreRepository storeRepository,
                           ProductRepository productRepository,
                           AddressRepository addressRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.storeRepository = storeRepository;
        this.productRepository = productRepository;
        this.addressRepository = addressRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.findByEmail("rider@nightdrop.com").isEmpty()) {
            User rider1 = User.builder()
                    .email("rider@nightdrop.com")
                    .password(passwordEncoder.encode("Rider@123"))
                    .fullName("Vikram Midnight Rider")
                    .phone("+91 9876543230")
                    .role(Role.DELIVERY_PARTNER)
                    .build();
            userRepository.save(rider1);
            log.info("Seeded delivery partner account rider@nightdrop.com");
        }

        if (userRepository.count() > 1) {
            log.info("Database already seeded with {} users. Skipping main initialization.", userRepository.count());
            return;
        }

        log.info("Starting initial seed data creation for NightDrop platform...");

        // 1. Users
        User admin = User.builder()
                .email("admin@nightdrop.com")
                .password(passwordEncoder.encode("Admin@123"))
                .fullName("NightDrop Admin")
                .phone("+91 9876543210")
                .role(Role.ADMIN)
                .build();
        userRepository.save(admin);

        User owner1 = User.builder()
                .email("diner@nightdrop.com")
                .password(passwordEncoder.encode("Owner@123"))
                .fullName("Chef Vikram Sharma")
                .phone("+91 9876543211")
                .role(Role.STORE_OWNER)
                .build();
        userRepository.save(owner1);

        User owner2 = User.builder()
                .email("pharmacy@nightdrop.com")
                .password(passwordEncoder.encode("Owner@123"))
                .fullName("Dr. Ananya Iyer")
                .phone("+91 9876543212")
                .role(Role.STORE_OWNER)
                .build();
        userRepository.save(owner2);

        User owner3 = User.builder()
                .email("mart@nightdrop.com")
                .password(passwordEncoder.encode("Owner@123"))
                .fullName("Rohan Gupta")
                .phone("+91 9876543213")
                .role(Role.STORE_OWNER)
                .build();
        userRepository.save(owner3);

        User owner4 = User.builder()
                .email("gadgets@nightdrop.com")
                .password(passwordEncoder.encode("Owner@123"))
                .fullName("Pooja Nair")
                .phone("+91 9876543214")
                .role(Role.STORE_OWNER)
                .build();
        userRepository.save(owner4);

        User owner5 = User.builder()
                .email("paws@nightdrop.com")
                .password(passwordEncoder.encode("Owner@123"))
                .fullName("Arjun Mehra")
                .phone("+91 9876543215")
                .role(Role.STORE_OWNER)
                .build();
        userRepository.save(owner5);

        User customer1 = User.builder()
                .email("customer@nightdrop.com")
                .password(passwordEncoder.encode("Customer@123"))
                .fullName("Rahul Verma")
                .phone("+91 9876543220")
                .role(Role.CUSTOMER)
                .build();
        userRepository.save(customer1);

        // Seed customer default address
        Address address1 = Address.builder()
                .user(customer1)
                .recipientName("Rahul Verma")
                .phone("+91 9876543220")
                .streetAddress("Flat 402, Skyline Residency, 12th Main")
                .city("Bengaluru")
                .state("Karnataka")
                .postalCode("560034")
                .landmark("Opposite Sony World Signal")
                .isDefault(true)
                .build();
        addressRepository.save(address1);

        // 2. Stores
        // Store 1: Overnight food diner (19:00 to 05:00)
        Store store1 = Store.builder()
                .name("Midnight Cravings Diner")
                .description("Hot, fresh rolls, juicy burgers, loaded fries and midnight sweet cravings delivered piping hot.")
                .address("42 Indiranagar 100ft Road, Bengaluru")
                .phone("+91 80 4123 5671")
                .imageUrl("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80")
                .openingTime(LocalTime.of(19, 0))
                .closingTime(LocalTime.of(5, 0))
                .isActive(true)
                .deliveryFee(BigDecimal.valueOf(49.00))
                .rating(4.8)
                .owner(owner1)
                .build();
        storeRepository.save(store1);

        // Store 2: 24/7 Pharmacy & Wellness (00:00 to 23:59)
        Store store2 = Store.builder()
                .name("NightOwl Pharmacy & Wellness")
                .description("Round-the-clock emergency health aids, first-aid kits, wellness products, and hygiene essentials.")
                .address("15 Koramangala 5th Block, Bengaluru")
                .phone("+91 80 4123 5672")
                .imageUrl("https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80")
                .openingTime(LocalTime.of(0, 0))
                .closingTime(LocalTime.of(23, 59))
                .isActive(true)
                .deliveryFee(BigDecimal.valueOf(30.00))
                .rating(4.9)
                .owner(owner2)
                .build();
        storeRepository.save(store2);

        // Store 3: 24/7 SuperMart (18:00 to 06:00)
        Store store3 = Store.builder()
                .name("24/7 Midnight SuperMart")
                .description("Daily groceries, instant noodles, milk, bread, late-night munchies and energy drinks.")
                .address("88 HSR Layout Sector 2, Bengaluru")
                .phone("+91 80 4123 5673")
                .imageUrl("https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80")
                .openingTime(LocalTime.of(18, 0))
                .closingTime(LocalTime.of(6, 0))
                .isActive(true)
                .deliveryFee(BigDecimal.valueOf(35.00))
                .rating(4.7)
                .owner(owner3)
                .build();
        storeRepository.save(store3);

        // Store 4: Tech & Cables (20:00 to 04:00)
        Store store4 = Store.builder()
                .name("TechBite Midnight Gadgets")
                .description("Broken charger at 2 AM? Rapid delivery for iPhone & Type-C chargers, power banks and audio gear.")
                .address("102 Whitefield Main Road, Bengaluru")
                .phone("+91 80 4123 5674")
                .imageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80")
                .openingTime(LocalTime.of(20, 0))
                .closingTime(LocalTime.of(4, 0))
                .isActive(true)
                .deliveryFee(BigDecimal.valueOf(50.00))
                .rating(4.6)
                .owner(owner4)
                .build();
        storeRepository.save(store4);

        // Store 5: Daytime Store (09:00 to 17:00) - Closed at night for testing closed state
        Store store5 = Store.builder()
                .name("Paws & Babies Midnight Care")
                .description("Emergency pet food, cat litter, infant baby formula, feeding bottles, and soft baby wipes.")
                .address("12 Jayanagar 4th Block, Bengaluru")
                .phone("+91 80 4123 5675")
                .imageUrl("https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80")
                .openingTime(LocalTime.of(9, 0))
                .closingTime(LocalTime.of(17, 0))
                .isActive(true)
                .deliveryFee(BigDecimal.valueOf(40.00))
                .rating(4.8)
                .owner(owner5)
                .build();
        storeRepository.save(store5);

        // 3. Products
        Product p1 = Product.builder()
                .store(store1)
                .name("Butter Chicken Kathi Roll")
                .description("Tender smoked chicken tossed in buttery makhani gravy wrapped in a crisp flaky paratha.")
                .category(ProductCategory.FOOD_AND_SNACKS)
                .price(BigDecimal.valueOf(189.00))
                .stockQuantity(30)
                .imageUrl("https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80")
                .isAvailable(true)
                .build();

        Product p2 = Product.builder()
                .store(store1)
                .name("Double Cheese Smash Burger")
                .description("Two premium smashed patties layered with melted cheddar, caramelised onions and secret sauce.")
                .category(ProductCategory.FOOD_AND_SNACKS)
                .price(BigDecimal.valueOf(249.00))
                .stockQuantity(25)
                .imageUrl("https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80")
                .isAvailable(true)
                .build();

        Product p3 = Product.builder()
                .store(store1)
                .name("Peri Peri Loaded Fries")
                .description("Crispy skin-on french fries dusted with spicy peri-peri rub and topped with molten cheese dip.")
                .category(ProductCategory.FOOD_AND_SNACKS)
                .price(BigDecimal.valueOf(139.00))
                .stockQuantity(40)
                .imageUrl("https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80")
                .isAvailable(true)
                .build();

        Product p4 = Product.builder()
                .store(store1)
                .name("Hot Sizzling Brownie with Fudge")
                .description("Decadent dark chocolate fudge brownie drenched in warm chocolate ganache.")
                .category(ProductCategory.FOOD_AND_SNACKS)
                .price(BigDecimal.valueOf(159.00))
                .stockQuantity(20)
                .imageUrl("https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80")
                .isAvailable(true)
                .build();

        Product p5 = Product.builder()
                .store(store2)
                .name("First-Aid & Bandage Essential Kit")
                .description("Comprehensive medical box with antiseptic liquid, sterile gauze, band-aids and micropore tape.")
                .category(ProductCategory.PERSONAL_CARE)
                .price(BigDecimal.valueOf(149.00))
                .stockQuantity(50)
                .imageUrl("https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=600&q=80")
                .isAvailable(true)
                .build();

        Product p6 = Product.builder()
                .store(store2)
                .name("Ayurvedic Headache & Cold Balm")
                .description("Fast-action pain relief balm for soothing stubborn midnight headaches and nasal congestion.")
                .category(ProductCategory.PERSONAL_CARE)
                .price(BigDecimal.valueOf(75.00))
                .stockQuantity(60)
                .imageUrl("https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80")
                .isAvailable(true)
                .build();

        Product p7 = Product.builder()
                .store(store2)
                .name("Hydration Electrolyte Drink (Pack of 3)")
                .description("Instant energy & oral rehydration drink packed with essential salts and vitamins.")
                .category(ProductCategory.PERSONAL_CARE)
                .price(BigDecimal.valueOf(110.00))
                .stockQuantity(45)
                .imageUrl("https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80")
                .isAvailable(true)
                .build();

        Product p8 = Product.builder()
                .store(store2)
                .name("Gentle Aloe Baby Wet Wipes (72 pcs)")
                .description("99% pure water hypoallergenic baby wipes with moisturizing aloe vera extract.")
                .category(ProductCategory.BABY_ESSENTIALS)
                .price(BigDecimal.valueOf(149.00))
                .stockQuantity(35)
                .imageUrl("https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80")
                .isAvailable(true)
                .build();

        Product p9 = Product.builder()
                .store(store3)
                .name("Spicy Masala Instant Noodles (Pack of 4)")
                .description("Classic late night noodles with signature desi spice blend. Ready in 2 minutes.")
                .category(ProductCategory.GROCERIES)
                .price(BigDecimal.valueOf(60.00))
                .stockQuantity(100)
                .imageUrl("https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80")
                .isAvailable(true)
                .build();

        Product p10 = Product.builder()
                .store(store3)
                .name("Fresh Whole Milk (1L Pouch)")
                .description("Pasteurized fresh whole cream milk delivered chilled.")
                .category(ProductCategory.GROCERIES)
                .price(BigDecimal.valueOf(68.00))
                .stockQuantity(50)
                .imageUrl("https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80")
                .isAvailable(true)
                .build();

        Product p11 = Product.builder()
                .store(store3)
                .name("Whole Wheat Brown Bread & Salted Butter")
                .description("Freshly baked 400g sliced brown bread accompanied by 100g table butter.")
                .category(ProductCategory.GROCERIES)
                .price(BigDecimal.valueOf(125.00))
                .stockQuantity(25)
                .imageUrl("https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80")
                .isAvailable(true)
                .build();

        Product p12 = Product.builder()
                .store(store3)
                .name("Sparkling Midnight Energy Drink (250ml)")
                .description("Crisp taurine-infused energy booster to fuel your late-night study and coding sessions.")
                .category(ProductCategory.FOOD_AND_SNACKS)
                .price(BigDecimal.valueOf(115.00))
                .stockQuantity(60)
                .imageUrl("https://images.unsplash.com/photo-1622543925917-763c34d1a86e?auto=format&fit=crop&w=600&q=80")
                .isAvailable(true)
                .build();

        Product p13 = Product.builder()
                .store(store4)
                .name("65W Braided Fast-Charging Type-C Cable")
                .description("Ultra-durable nylon braided 1.5m cable supporting 65W PD fast charging and high-speed data.")
                .category(ProductCategory.ELECTRONICS_AND_ACCESSORIES)
                .price(BigDecimal.valueOf(399.00))
                .stockQuantity(30)
                .imageUrl("https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80")
                .isAvailable(true)
                .build();

        Product p14 = Product.builder()
                .store(store4)
                .name("20W Dual-Port USB & Type-C Wall Charger")
                .description("Compact fast charging adapter with surge protection, compatible with iOS & Android devices.")
                .category(ProductCategory.ELECTRONICS_AND_ACCESSORIES)
                .price(BigDecimal.valueOf(599.00))
                .stockQuantity(20)
                .imageUrl("https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80")
                .isAvailable(true)
                .build();

        Product p15 = Product.builder()
                .store(store4)
                .name("10,000mAh Slim Power Bank with Display")
                .description("Pocket-sized high density lithium battery with digital percentage display and 22.5W output.")
                .category(ProductCategory.ELECTRONICS_AND_ACCESSORIES)
                .price(BigDecimal.valueOf(1199.00))
                .stockQuantity(15)
                .imageUrl("https://images.unsplash.com/photo-1609592424109-dd9892f1b177?auto=format&fit=crop&w=600&q=80")
                .isAvailable(true)
                .build();

        Product p16 = Product.builder()
                .store(store4)
                .name("Low-Latency Bluetooth Wireless Earbuds")
                .description("Crisp deep bass with 40ms low latency gaming mode and 28-hour total battery life.")
                .category(ProductCategory.ELECTRONICS_AND_ACCESSORIES)
                .price(BigDecimal.valueOf(1499.00))
                .stockQuantity(12)
                .imageUrl("https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80")
                .isAvailable(true)
                .build();

        Product p17 = Product.builder()
                .store(store5)
                .name("Gourmet Wet Cat Food Gravy (Pack of 4)")
                .description("Tender tuna and salmon chunks in savory gravy, enriched with taurine and Omega 3.")
                .category(ProductCategory.PET_ESSENTIALS)
                .price(BigDecimal.valueOf(199.00))
                .stockQuantity(40)
                .imageUrl("https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80")
                .isAvailable(true)
                .build();

        Product p18 = Product.builder()
                .store(store5)
                .name("Premium Adult Dog Food Chicken & Rice (1.2kg)")
                .description("Balanced high-protein kibble supporting strong muscles and healthy digestion in dogs.")
                .category(ProductCategory.PET_ESSENTIALS)
                .price(BigDecimal.valueOf(375.00))
                .stockQuantity(25)
                .imageUrl("https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=600&q=80")
                .isAvailable(true)
                .build();

        Product p19 = Product.builder()
                .store(store5)
                .name("Soft Comfort Baby Diapers (Size M, 24 pcs)")
                .description("12-hour leak-lock protection with breathable cottony softness and wetness indicator.")
                .category(ProductCategory.BABY_ESSENTIALS)
                .price(BigDecimal.valueOf(399.00))
                .stockQuantity(30)
                .imageUrl("https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80")
                .isAvailable(true)
                .build();

        Product p20 = Product.builder()
                .store(store5)
                .name("Anti-Colic Baby Feeding Bottle (240ml)")
                .description("BPA-free silicone teat designed to reduce gas, reflux and colic discomfort.")
                .category(ProductCategory.BABY_ESSENTIALS)
                .price(BigDecimal.valueOf(280.00))
                .stockQuantity(20)
                .imageUrl("https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80")
                .isAvailable(true)
                .build();

        productRepository.saveAll(List.of(
                p1, p2, p3, p4, p5, p6, p7, p8, p9, p10,
                p11, p12, p13, p14, p15, p16, p17, p18, p19, p20
        ));

        log.info("Successfully seeded 6 users, 5 stores, and 20 products across all 6 categories.");
    }
}
