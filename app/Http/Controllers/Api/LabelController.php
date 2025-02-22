<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Label;
use Illuminate\Http\Request;

class LabelController extends Controller
{
    public function index()
    {
        return response()->json(Label::with('creator')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);

        $label = Label::create([
            'name' => $request->name,
            'description' => $request->description,
            'created_by' => auth()->id()
        ]);

        return response()->json($label, 201);
    }

    public function show(Label $label)
    {
        return response()->json($label->load('creator'));
    }

    public function update(Request $request, Label $label)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);

        $label->update($request->all());

        return response()->json($label);
    }

    public function destroy(Label $label)
    {
        $label->delete();
        return response()->json(null, 204);
    }
}