<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Sport;

class SportsController extends Controller
{
    public function index(Request $request)
    {
        $data = Sport::all();

        return response()->json([
            "status" => "success",
            "data" => $data
        ]);
    }
}
