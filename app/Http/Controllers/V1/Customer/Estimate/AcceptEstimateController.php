<?php

namespace App\Http\Controllers\V1\Customer\Estimate;

use App\Http\Controllers\Controller;
use App\Http\Resources\Customer\EstimateResource;
use App\Models\Company;
use App\Models\Estimate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AcceptEstimateController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, Company $company, Estimate $estimate)
    {
        if ($estimate->customer_id !== Auth::guard('customer')->id()) {
            return response()->json(['error' => 'estimate_not_found'], 404);
        }

        $estimate->update($request->only('status'));

        return new EstimateResource($estimate);
    }
}
