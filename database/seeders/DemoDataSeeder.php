<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\CompanySetting;
use App\Models\Customer;
use App\Models\Estimate;
use App\Models\EstimateItem;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Item;
use App\Models\Payment;
use App\Models\PaymentMethod;
use App\Models\Setting;
use App\Models\Tax;
use App\Models\TaxType;
use App\Models\Unit;
use App\Models\User;
use App\Space\InstallUtils;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Silber\Bouncer\BouncerFacade;
use Vinkla\Hashids\Facades\Hashids;

class DemoDataSeeder extends Seeder
{
    private $company;

    private $user;

    private $customers;

    private $items;

    private $paymentMethods;

    private $taxes;

    private $expenseCategories;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Cleaning existing demo data...');
        $this->cleanExistingDemoData();
        
        $this->command->info('Creating demo user and company...');
        $this->createUserAndCompany();
        
        $this->command->info('Setting up basic data...');
        $this->setupBasicData();
        
        $this->command->info('Creating customers...');
        $this->createCustomers();
        
        $this->command->info('Creating items and services...');
        $this->createItems();
        
        $this->command->info('Creating invoices with different statuses...');
        $this->createInvoices();
        
        $this->command->info('Creating estimates...');
        $this->createEstimates();
        
        $this->command->info('Creating payments...');
        $this->createPayments();
        
        $this->command->info('Creating expenses...');
        $this->createExpenses();
        
        $this->command->info('Finalizing setup...');
        $this->finalizeSetup();
        
        $this->command->info('Demo data created successfully!');
        $this->printCredentials();
    }

    private function cleanExistingDemoData()
    {
        // Find and clean demo user and related data
        $demoUser = User::where('email', 'demo@invoiceshelf.com')->first();
        if ($demoUser) {
            $this->command->info('Found existing demo data, cleaning...');
            
            // Get demo company
            $demoCompany = $demoUser->companies()->where('name', 'InvoiceShelf Demo Company')->first();
            
            if ($demoCompany) {
                // Delete company-related data
                $demoCompany->invoices()->delete();
                $demoCompany->estimates()->delete();
                $demoCompany->payments()->delete();
                $demoCompany->expenses()->delete();
                $demoCompany->customers()->delete();
                $demoCompany->items()->delete();
                $demoCompany->paymentMethods()->delete();
                $demoCompany->taxes()->delete();
                $demoCompany->taxTypes()->delete();
                $demoCompany->units()->delete();
                $demoCompany->expenseCategories()->delete();
                
                // Delete company
                $demoCompany->delete();
            }
            
            // Delete demo user
            $demoUser->delete();
        }
    }

    private function createUserAndCompany()
    {
        // Create demo user
        $this->user = User::factory()->create([
            'email' => 'demo@invoiceshelf.com',
            'name' => 'Demo Admin',
            'role' => 'super admin',
            'password' => 'demo123',
        ]);

        // Create demo company
        $this->company = Company::factory()->create([
            'name' => 'InvoiceShelf Demo Company',
            'owner_id' => $this->user->id,
            'slug' => 'demo-company',
        ]);

        $this->company->unique_hash = Hashids::connection(Company::class)->encode($this->company->id);
        $this->company->save();
        $this->company->setupDefaultData();
        $this->user->companies()->attach($this->company->id);
        BouncerFacade::scope()->to($this->company->id);

        $this->user->assign('super admin');

        // Set default user settings
        $this->user->setSettings([
            'language' => 'en',
            'timezone' => 'UTC',
            'date_format' => 'DD-MM-YYYY',
            'currency_id' => 1, // USD
        ]);

        // Set company settings
        CompanySetting::setSettings([
            'currency' => 1,
            'date_format' => 'DD-MM-YYYY',
            'language' => 'en',
            'timezone' => 'UTC',
            'fiscal_year' => 'calendar_year',
            'tax_per_item' => false,
            'discount_per_item' => false,
            'invoice_prefix' => 'INV-',
            'estimate_prefix' => 'EST-',
            'payment_prefix' => 'PAY-',
        ], $this->company->id);
    }

    private function setupBasicData()
    {
        // Create payment methods
        $this->paymentMethods = collect([
            PaymentMethod::factory()->create([
                'company_id' => $this->company->id,
                'name' => 'Cash',
            ]),
            PaymentMethod::factory()->create([
                'company_id' => $this->company->id,
                'name' => 'Credit Card',
            ]),
            PaymentMethod::factory()->create([
                'company_id' => $this->company->id,
                'name' => 'Bank Transfer',
            ]),
            PaymentMethod::factory()->create([
                'company_id' => $this->company->id,
                'name' => 'PayPal',
            ]),
        ]);

        // Create tax types and taxes
        $taxType = TaxType::factory()->create([
            'company_id' => $this->company->id,
            'name' => 'Sales Tax',
        ]);

        $this->taxes = collect([
            Tax::factory()->create([
                'company_id' => $this->company->id,
                'tax_type_id' => $taxType->id,
                'name' => 'VAT 10%',
                'percent' => 10,
            ]),
            Tax::factory()->create([
                'company_id' => $this->company->id,
                'tax_type_id' => $taxType->id,
                'name' => 'VAT 21%',
                'percent' => 21,
            ]),
        ]);

        // Create units
        $units = [
            ['name' => 'Hours', 'company_id' => $this->company->id],
            ['name' => 'Pieces', 'company_id' => $this->company->id],
            ['name' => 'Days', 'company_id' => $this->company->id],
        ];

        foreach ($units as $unit) {
            Unit::factory()->create($unit);
        }

        // Create expense categories
        $this->expenseCategories = collect([
            ExpenseCategory::factory()->create([
                'company_id' => $this->company->id,
                'name' => 'Office Supplies',
            ]),
            ExpenseCategory::factory()->create([
                'company_id' => $this->company->id,
                'name' => 'Travel',
            ]),
            ExpenseCategory::factory()->create([
                'company_id' => $this->company->id,
                'name' => 'Software',
            ]),
            ExpenseCategory::factory()->create([
                'company_id' => $this->company->id,
                'name' => 'Marketing',
            ]),
        ]);
    }

    private function createCustomers()
    {
        $customerData = [
            [
                'name' => 'Acme Corporation',
                'email' => 'contact@acme.com',
                'enable_portal' => true,
                'phone' => '+1-555-0101',
                'website' => 'https://acme.com',
            ],
            [
                'name' => 'TechStart Inc.',
                'email' => 'hello@techstart.com',
                'enable_portal' => true,
                'phone' => '+1-555-0102',
                'website' => 'https://techstart.com',
            ],
            [
                'name' => 'Global Solutions Ltd.',
                'email' => 'info@globalsolutions.com',
                'enable_portal' => true,
                'phone' => '+1-555-0103',
                'website' => 'https://globalsolutions.com',
            ],
            [
                'name' => 'Creative Agency',
                'email' => 'projects@creative.com',
                'enable_portal' => false,
                'phone' => '+1-555-0104',
                'website' => 'https://creative.com',
            ],
            [
                'name' => 'Manufacturing Co.',
                'email' => 'orders@manufacturing.com',
                'enable_portal' => true,
                'phone' => '+1-555-0105',
                'website' => 'https://manufacturing.com',
            ],
        ];

        $this->customers = collect();
        foreach ($customerData as $data) {
            $customer = Customer::factory()->create(array_merge($data, [
                'company_id' => $this->company->id,
            ]));
            $this->customers->push($customer);
        }

        // Create additional random customers
        for ($i = 0; $i < 10; $i++) {
            $customer = Customer::factory()->create([
                'company_id' => $this->company->id,
                'enable_portal' => $i % 3 === 0, // Some with portal enabled
            ]);
            $this->customers->push($customer);
        }
    }

    private function createItems()
    {
        $itemsData = [
            [
                'name' => 'Web Development',
                'description' => 'Custom web application development',
                'price' => 15000,
                'unit_id' => 1,
            ],
            [
                'name' => 'Consulting Services',
                'description' => 'Business consulting and strategy',
                'price' => 150,
                'unit_id' => 1,
            ],
            [
                'name' => 'Logo Design',
                'description' => 'Professional logo design service',
                'price' => 500,
                'unit_id' => 2,
            ],
            [
                'name' => 'SEO Optimization',
                'description' => 'Search engine optimization service',
                'price' => 800,
                'unit_id' => 3,
            ],
            [
                'name' => 'Mobile App Development',
                'description' => 'iOS and Android app development',
                'price' => 25000,
                'unit_id' => 2,
            ],
        ];

        $this->items = collect();
        foreach ($itemsData as $data) {
            $item = Item::factory()->create(array_merge($data, [
                'company_id' => $this->company->id,
            ]));
            $this->items->push($item);
        }
    }

    private function createInvoices()
    {
        $invoiceConfigs = [
            // Recent unpaid invoices (for active filter demo)
            ['status' => 'SENT', 'paid_status' => 'UNPAID', 'days_ago' => 5, 'count' => 3],
            ['status' => 'VIEWED', 'paid_status' => 'UNPAID', 'days_ago' => 10, 'count' => 2],
            ['status' => 'VIEWED', 'paid_status' => 'PARTIALLY_PAID', 'days_ago' => 15, 'count' => 2],
            
            // Completed/paid invoices
            ['status' => 'COMPLETED', 'paid_status' => 'PAID', 'days_ago' => 30, 'count' => 5],
            ['status' => 'COMPLETED', 'paid_status' => 'PAID', 'days_ago' => 60, 'count' => 4],
            
            // Draft invoices
            ['status' => 'DRAFT', 'paid_status' => 'UNPAID', 'days_ago' => 1, 'count' => 2],
            
            // Overdue invoices
            ['status' => 'SENT', 'paid_status' => 'UNPAID', 'days_ago' => 45, 'count' => 3],
        ];

        foreach ($invoiceConfigs as $config) {
            for ($i = 0; $i < $config['count']; $i++) {
                $customer = $this->customers->random();
                $invoiceDate = Carbon::now()->subDays($config['days_ago'] + rand(0, 5));
                $dueDate = $invoiceDate->copy()->addDays(30);
                
                $subTotal = rand(1000, 10000);
                $tax = $subTotal * 0.1; // 10% tax
                $total = $subTotal + $tax;
                
                $dueAmount = $config['paid_status'] === 'PAID' ? 0 : 
                           ($config['paid_status'] === 'PARTIALLY_PAID' ? $total * 0.5 : $total);

                $invoice = Invoice::factory()->create([
                    'company_id' => $this->company->id,
                    'customer_id' => $customer->id,
                    'invoice_date' => $invoiceDate,
                    'due_date' => $dueDate,
                    'status' => $config['status'],
                    'paid_status' => $config['paid_status'],
                    'sub_total' => $subTotal,
                    'total' => $total,
                    'due_amount' => $dueAmount,
                    'base_sub_total' => $subTotal,
                    'base_total' => $total,
                    'base_due_amount' => $dueAmount,
                    'tax' => $tax,
                    'base_tax' => $tax,
                ]);

                // Add invoice items
                $itemCount = rand(1, 3);
                for ($j = 0; $j < $itemCount; $j++) {
                    $item = $this->items->random();
                    $quantity = rand(1, 5);
                    $price = $item->price;
                    $itemTotal = $quantity * $price;

                    InvoiceItem::factory()->create([
                        'invoice_id' => $invoice->id,
                        'item_id' => $item->id,
                        'name' => $item->name,
                        'description' => $item->description,
                        'quantity' => $quantity,
                        'price' => $price,
                        'total' => $itemTotal,
                        'base_price' => $price,
                        'base_total' => $itemTotal,
                        'company_id' => $this->company->id,
                    ]);
                }
            }
        }
    }

    private function createEstimates()
    {
        $estimateConfigs = [
            // Active estimates (for filter demo)
            ['status' => 'SENT', 'days_ago' => 3, 'count' => 3],
            ['status' => 'VIEWED', 'days_ago' => 7, 'count' => 2],
            
            // Accepted estimates
            ['status' => 'ACCEPTED', 'days_ago' => 20, 'count' => 4],
            
            // Rejected estimates
            ['status' => 'REJECTED', 'days_ago' => 25, 'count' => 2],
            
            // Draft estimates
            ['status' => 'DRAFT', 'days_ago' => 1, 'count' => 2],
            
            // Expired estimates
            ['status' => 'EXPIRED', 'days_ago' => 60, 'count' => 2],
        ];

        foreach ($estimateConfigs as $config) {
            for ($i = 0; $i < $config['count']; $i++) {
                $customer = $this->customers->random();
                $estimateDate = Carbon::now()->subDays($config['days_ago'] + rand(0, 3));
                $expiryDate = $estimateDate->copy()->addDays(30);
                
                $subTotal = rand(2000, 15000);
                $tax = $subTotal * 0.1;
                $total = $subTotal + $tax;

                $estimate = Estimate::factory()->create([
                    'company_id' => $this->company->id,
                    'customer_id' => $customer->id,
                    'estimate_date' => $estimateDate,
                    'expiry_date' => $expiryDate,
                    'status' => $config['status'],
                    'sub_total' => $subTotal,
                    'total' => $total,
                    'base_sub_total' => $subTotal,
                    'base_total' => $total,
                    'tax' => $tax,
                    'base_tax' => $tax,
                ]);

                // Add estimate items
                $itemCount = rand(1, 4);
                for ($j = 0; $j < $itemCount; $j++) {
                    $item = $this->items->random();
                    $quantity = rand(1, 3);
                    $price = $item->price;
                    $itemTotal = $quantity * $price;

                    EstimateItem::factory()->create([
                        'estimate_id' => $estimate->id,
                        'item_id' => $item->id,
                        'name' => $item->name,
                        'description' => $item->description,
                        'quantity' => $quantity,
                        'price' => $price,
                        'total' => $itemTotal,
                        'base_price' => $price,
                        'base_total' => $itemTotal,
                        'company_id' => $this->company->id,
                    ]);
                }
            }
        }
    }

    private function createPayments()
    {
        // Get paid and partially paid invoices
        $paidInvoices = Invoice::where('company_id', $this->company->id)
            ->whereIn('paid_status', ['PAID', 'PARTIALLY_PAID'])
            ->get();

        foreach ($paidInvoices as $invoice) {
            $paymentAmount = $invoice->paid_status === 'PAID' ? 
                $invoice->total : $invoice->total * 0.5;

            Payment::factory()->create([
                'company_id' => $this->company->id,
                'customer_id' => $invoice->customer_id,
                'invoice_id' => $invoice->id,
                'payment_method_id' => $this->paymentMethods->random()->id,
                'amount' => $paymentAmount,
                'base_amount' => $paymentAmount,
                'payment_date' => Carbon::parse($invoice->invoice_date)->addDays(rand(1, 15)),
                'notes' => 'Payment for invoice ' . $invoice->invoice_number,
            ]);
        }

        // Create some standalone payments
        for ($i = 0; $i < 5; $i++) {
            Payment::factory()->create([
                'company_id' => $this->company->id,
                'customer_id' => $this->customers->random()->id,
                'payment_method_id' => $this->paymentMethods->random()->id,
                'amount' => rand(500, 3000),
                'base_amount' => rand(500, 3000),
                'payment_date' => Carbon::now()->subDays(rand(1, 90)),
                'notes' => 'Advance payment',
            ]);
        }
    }

    private function createExpenses()
    {
        $expenseData = [
            ['amount' => 250, 'category' => 'Office Supplies', 'days_ago' => 5],
            ['amount' => 1200, 'category' => 'Travel', 'days_ago' => 10],
            ['amount' => 99, 'category' => 'Software', 'days_ago' => 15],
            ['amount' => 800, 'category' => 'Marketing', 'days_ago' => 20],
            ['amount' => 450, 'category' => 'Office Supplies', 'days_ago' => 25],
            ['amount' => 2000, 'category' => 'Travel', 'days_ago' => 30],
            ['amount' => 199, 'category' => 'Software', 'days_ago' => 35],
            ['amount' => 1500, 'category' => 'Marketing', 'days_ago' => 40],
        ];

        foreach ($expenseData as $data) {
            $category = $this->expenseCategories->firstWhere('name', $data['category']);
            
            Expense::factory()->create([
                'company_id' => $this->company->id,
                'expense_category_id' => $category->id,
                'amount' => $data['amount'],
                'base_amount' => $data['amount'],
                'expense_date' => Carbon::now()->subDays($data['days_ago']),
                'notes' => 'Business expense for ' . $data['category'],
            ]);
        }
    }

    private function finalizeSetup()
    {
        // Mark profile setup as complete
        Setting::setSetting('profile_complete', 'COMPLETED');

        // Create installation marker
        InstallUtils::createDbMarker();
    }

    private function printCredentials()
    {
        $this->command->line('');
        $this->command->line('=================================');
        $this->command->line('   DEMO CREDENTIALS');
        $this->command->line('=================================');
        $this->command->line('Email: demo@invoiceshelf.com');
        $this->command->line('Password: demo123');
        $this->command->line('Company: ' . $this->company->name);
        $this->command->line('=================================');
        $this->command->line('');
        $this->command->line('Demo data includes:');
        $this->command->line('- ' . $this->customers->count() . ' customers (some with portal access)');
        $this->command->line('- ~25 invoices with various statuses');
        $this->command->line('- ~15 estimates in different states');
        $this->command->line('- Multiple payments and expenses');
        $this->command->line('- Items, taxes, and payment methods');
        $this->command->line('');
        $this->command->line('Perfect for demonstrating dashboard filters!');
    }
} 