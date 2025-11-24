
// /components/dashboard/weekly-goal.tsx

'use client'

export default function WeeklyGoal() {
  // Default values - you can replace with actual data from your API
  const hoursCompleted = 5
  const hoursGoal = 7
  const percentage = Math.round((hoursCompleted / hoursGoal) * 100)
  const hoursRemaining = hoursGoal - hoursCompleted

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Weekly Goal</h2>
      
      <div className="mb-6">
        <p className="text-3xl font-bold text-gray-900 mb-1">
          {hoursCompleted} of {hoursGoal} <span className="text-lg text-gray-600">hours</span>
        </p>
        <p className="text-sm text-gray-600">Keep up with your weekly goals</p>
      </div>

      <div className="bg-gray-200 rounded-full h-4 mb-6 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      <div className="text-center p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-600">
          {hoursRemaining > 0 ? (
            <>📝 <span className="font-medium">{hoursRemaining} more hours to reach your weekly goals!</span></>
          ) : (
            <>🎉 <span className="font-medium">You've reached your weekly goal!</span></>
          )}
        </p>
      </div>
    </div>
  )
}