<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\Currency;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\RecurringInvoice;
use App\Services\SerialNumberFormatter;
use Illuminate\Database\Eloquent\Factories\Factory;

class InvoiceFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Invoice::class;

    public function sent()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => Invoice::STATUS_SENT,
            ];
        });
    }

    public function viewed()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => Invoice::STATUS_VIEWED,
            ];
        });
    }

    public function completed()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => Invoice::STATUS_COMPLETED,
            ];
        });
    }

    public function unpaid()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => Invoice::STATUS_UNPAID,
            ];
        });
    }

    public function partiallyPaid()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => Invoice::STATUS_PARTIALLY_PAID,
            ];
        });
    }

    public function paid()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => Invoice::STATUS_PAID,
            ];
        });
    }

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        // For testing purposes, create a temporary company to get sequence numbers
        $tempCompany = Company::first() ?: Company::factory()->create();

        // Create basic company settings for testing if they don't exist
        if (! $tempCompany->settings()->where('option', 'invoice_number_format')->exists()) {
            $tempCompany->settings()->create([
                'option' => 'invoice_number_format',
                'value' => 'INV-{{SEQUENCE:6}}',
            ]);
        }

        $sequenceNumber = (new SerialNumberFormatter)
            ->setModel(new Invoice)
            ->setCompany($tempCompany->id)
            ->setNextNumbers();

        return [
            'invoice_date' => $this->faker->date('Y-m-d', 'now'),
            'due_date' => $this->faker->date('Y-m-d', 'now'),
            'invoice_number' => $sequenceNumber->getNextNumber(),
            'sequence_number' => $sequenceNumber->nextSequenceNumber,
            'customer_sequence_number' => $sequenceNumber->nextCustomerSequenceNumber,
            'reference_number' => $sequenceNumber->getNextNumber(),
            'template_name' => 'invoice1',
            'status' => Invoice::STATUS_DRAFT,
            'tax_per_item' => 'NO',
            'discount_per_item' => 'NO',
            'paid_status' => Invoice::STATUS_UNPAID,
            'company_id' => Company::factory(),
            'sub_total' => $this->faker->randomDigitNotNull(),
            'total' => $this->faker->randomDigitNotNull(),
            'discount_type' => $this->faker->randomElement(['percentage', 'fixed']),
            'discount_val' => function (array $invoice) {
                return $invoice['discount_type'] == 'percentage' ? $this->faker->numberBetween($min = 0, $max = 100) : $this->faker->randomDigitNotNull();
            },
            'discount' => function (array $invoice) {
                return $invoice['discount_type'] == 'percentage' ? (($invoice['discount_val'] * $invoice['total']) / 100) : $invoice['discount_val'];
            },
            'tax' => $this->faker->randomDigitNotNull(),
            'due_amount' => function (array $invoice) {
                return $invoice['total'];
            },
            'notes' => $this->faker->text(80),
            'unique_hash' => str_random(60),
            'customer_id' => Customer::factory(),
            'recurring_invoice_id' => RecurringInvoice::factory(),
            'exchange_rate' => $this->faker->randomDigitNotNull(),
            'base_discount_val' => $this->faker->randomDigitNotNull(),
            'base_sub_total' => $this->faker->randomDigitNotNull(),
            'base_total' => $this->faker->randomDigitNotNull(),
            'base_tax' => $this->faker->randomDigitNotNull(),
            'base_due_amount' => $this->faker->randomDigitNotNull(),
            'currency_id' => Currency::first()->id,
        ];
    }

    public function forCompany($company)
    {
        return $this->state(function (array $attributes) use ($company) {
            return [
                'company_id' => $company->id,
            ];
        });
    }

    public function forCustomer($customer)
    {
        return $this->state(function (array $attributes) use ($customer) {
            return [
                'customer_id' => $customer->id,
            ];
        });
    }
}
